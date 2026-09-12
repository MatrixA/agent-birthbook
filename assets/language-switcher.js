/* global path_to_root */

(function () {
    "use strict";

    const language = document.documentElement.lang;
    const isChinese = language.toLowerCase() === "zh-cn";
    const rootDepth = (path_to_root.match(/\.\.\//g) || []).length;
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const directoryPath = rootDepth ? pathParts.slice(-rootDepth).join("/") : "";
    const pagePath = window.location.pathname.endsWith("/")
        ? `${directoryPath ? `${directoryPath}/` : ""}index.html`
        : pathParts.slice(-(rootDepth + 1)).join("/") || "index.html";
    const languageRoot = new URL(path_to_root || "./", window.location.href);
    const siteRoot = isChinese ? new URL("../", languageRoot) : languageRoot;
    const targetPath = isChinese ? pagePath : `zh-CN/${pagePath}`;
    const target = new URL(targetPath, siteRoot);

    target.search = window.location.search;
    target.hash = window.location.hash;

    const switcher = document.createElement("a");
    switcher.className = "language-switcher";
    switcher.href = target.href;
    switcher.hreflang = isChinese ? "en" : "zh-CN";
    switcher.lang = isChinese ? "en" : "zh-CN";
    switcher.textContent = isChinese ? "English" : "中文";
    switcher.title = isChinese ? "Switch to English" : "切换到简体中文";
    switcher.setAttribute("aria-label", switcher.title);

    const rightButtons = document.querySelector("#mdbook-menu-bar .right-buttons");
    if (rightButtons) {
        rightButtons.prepend(switcher);
    }

    if (!isChinese) {
        return;
    }

    const setAttributes = (selector, values) => {
        const element = document.querySelector(selector);
        if (!element) return;
        for (const [name, value] of Object.entries(values)) {
            element.setAttribute(name, value);
        }
    };

    setAttributes("#mdbook-sidebar-toggle", {
        title: "切换目录",
        "aria-label": "切换目录",
    });
    setAttributes("#mdbook-theme-toggle", {
        title: "切换主题",
        "aria-label": "切换主题",
    });
    setAttributes("#mdbook-search-toggle", {
        title: "搜索（/）",
        "aria-label": "切换搜索栏",
    });
    setAttributes("#mdbook-sidebar", { "aria-label": "目录" });
    setAttributes("#mdbook-theme-list", { "aria-label": "主题" });
    document
        .querySelectorAll("nav.nav-wrapper, nav.nav-wide-wrapper")
        .forEach((navigation) => navigation.setAttribute("aria-label", "页面导航"));
    setAttributes("#print-button", {
        title: "打印本书",
        "aria-label": "打印本书",
    });

    const printLink = document.querySelector("#print-button")?.closest("a");
    if (printLink) {
        printLink.title = "打印本书";
        printLink.setAttribute("aria-label", "打印本书");
    }

    const repositoryLink = document.querySelector('a[title="Git repository"]');
    if (repositoryLink) {
        repositoryLink.title = "源代码仓库";
        repositoryLink.setAttribute("aria-label", "源代码仓库");
    }

    const editLink = document.querySelector('a[rel="edit"]');
    if (editLink) {
        editLink.href = "https://github.com/MatrixA/agent-birthbook/edit/main/po/zh-CN.po";
        editLink.title = "修改中文翻译";
        editLink.setAttribute("aria-label", "修改中文翻译");
    }

    const searchInput = document.querySelector("#mdbook-searchbar");
    if (searchInput) {
        searchInput.placeholder = "搜索本书……";
        const queryTerm = new URLSearchParams(window.location.search).get("search");
        if (queryTerm && !searchInput.value) searchInput.value = queryTerm;
    }

    const escapeHtml = (value) =>
        value.replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        })[character]);

    const renderChineseSearchResults = (attempt = 0) => {
        const term = searchInput?.value.trim();
        if (!term || !/[\u3400-\u9fff]/u.test(term)) return;

        const documents = window.search?.index?.documentStore?.docs;
        const urls = window.search?.doc_urls;
        if (!documents || !urls) {
            const searchIndexScript = document.querySelector("#mdbook-search-index");
            if (searchIndexScript && !searchIndexScript.dataset.chineseSearchListener) {
                searchIndexScript.dataset.chineseSearchListener = "true";
                searchIndexScript.addEventListener(
                    "load",
                    () => renderChineseSearchResults(),
                    { once: true },
                );
            }
            if (attempt < 300) {
                window.setTimeout(() => renderChineseSearchResults(attempt + 1), 100);
            }
            return;
        }

        const results = Object.values(documents)
            .map((document) => {
                const titleMatch = document.title.includes(term);
                const breadcrumbMatch = document.breadcrumbs.includes(term);
                const bodyMatch = document.body.includes(term);
                return {
                    document,
                    score: titleMatch ? 3 : breadcrumbMatch ? 2 : bodyMatch ? 1 : 0,
                };
            })
            .filter((result) => result.score > 0)
            .sort((left, right) => right.score - left.score)
            .slice(0, 20);

        const list = document.querySelector("#mdbook-searchresults");
        const header = document.querySelector("#mdbook-searchresults-header");
        const outer = document.querySelector("#mdbook-searchresults-outer");
        if (!list || !header || !outer) return;

        list.replaceChildren();
        header.textContent = results.length
            ? `${results.length} 条搜索结果：“${term}”`
            : `没有找到“${term}”`;

        results.forEach(({ document: result }, index) => {
            const sourceUrl = urls[Number(result.id)] || "index.html";
            const [page, anchor = ""] = sourceUrl.split("#");
            const bodyIndex = result.body.indexOf(term);
            const teaserStart = Math.max(0, bodyIndex - 55);
            const teaserEnd = Math.min(result.body.length, bodyIndex + term.length + 75);
            const rawTeaser = result.body.slice(teaserStart, teaserEnd);
            const highlightedTeaser = escapeHtml(rawTeaser).replaceAll(
                escapeHtml(term),
                `<em>${escapeHtml(term)}</em>`,
            );

            const item = document.createElement("li");
            const detailsId = `mdbook-chinese-teaser-${index}`;
            const link = document.createElement("a");
            link.href = `${path_to_root}${page}?highlight=${encodeURIComponent(term)}#${anchor}`;
            link.setAttribute("aria-details", detailsId);
            link.textContent = result.breadcrumbs;

            const teaser = document.createElement("span");
            teaser.className = "teaser";
            teaser.id = detailsId;
            teaser.setAttribute("aria-label", "搜索结果摘要");
            teaser.innerHTML = `${teaserStart > 0 ? "…" : ""}${highlightedTeaser}${
                teaserEnd < result.body.length ? "…" : ""
            }`;

            item.append(link, teaser);
            list.append(item);
        });
        outer.classList.remove("hidden");
    };

    searchInput?.addEventListener("input", () => {
        window.setTimeout(() => renderChineseSearchResults(), 0);
    });
    window.setTimeout(() => renderChineseSearchResults(), 0);

    document.querySelectorAll('a[rel~="prev"]').forEach((link) => {
        link.title = "上一章";
        link.setAttribute("aria-label", "上一章");
    });
    document.querySelectorAll('a[rel~="next"]').forEach((link) => {
        link.title = "下一章";
        link.setAttribute("aria-label", "下一章");
    });

    const helpTitle = document.querySelector(".mdbook-help-title");
    if (helpTitle) helpTitle.textContent = "键盘快捷键";

    const helpParagraphs = document.querySelectorAll("#mdbook-help-popup p");
    const key = (label) => ({ key: label });
    const helpContent = [
        ["按 ", key("←"), " 或 ", key("→"), " 在章节间导航"],
        ["按 ", key("S"), " 或 ", key("/"), " 搜索本书"],
        ["按 ", key("?"), " 显示帮助"],
        ["按 ", key("Esc"), " 隐藏帮助"],
    ];
    helpParagraphs.forEach((paragraph, index) => {
        const content = helpContent[index];
        if (!content) return;
        paragraph.replaceChildren(
            ...content.map((part) => {
                if (typeof part === "string") return document.createTextNode(part);
                const keyboardKey = document.createElement("kbd");
                keyboardKey.textContent = part.key;
                return keyboardKey;
            }),
        );
    });

    const themeNames = {
        "mdbook-theme-default_theme": "自动",
        "mdbook-theme-light": "浅色",
        "mdbook-theme-rust": "Rust",
        "mdbook-theme-coal": "深灰",
        "mdbook-theme-navy": "藏青",
        "mdbook-theme-ayu": "Ayu",
    };
    for (const [id, label] of Object.entries(themeNames)) {
        const button = document.getElementById(id);
        if (button) button.textContent = label;
    }
})();
