const buildTree = () => {
    const input = document.getElementById("input");
    if (input) {
        const cleanInput = input.value.replace(/[^/\w\n.-]/g, "");
        const splitInput = cleanInput.split("\n");

        let splitFiles = [];
        let maxPath = 0;

        for (let i = 0; i < splitInput.length; i++) {
            let path = splitInput[i];

            path = path.replace(/\/+/g, "/");

            if (path.charAt(0) !== "/") {
                path = "/" + path;
            };

            path = path.replace(/\/$/, "");

            let splitPath = path.split("/");

            for (let i = 0; i < splitPath.length; i++) {
                if (i === 0 || splitPath[i + 1]) {
                    splitPath[i] = splitPath[i] + "/";
                };
            };

            splitFiles.push(splitPath);

            if (splitPath.length > maxPath) {
                maxPath = splitPath.length;
            };
        };

        splitFiles.sort((a, b) => {
            const sortAllColumns = (colIndex) => {
                const x = a[colIndex];
                const y = b[colIndex];
                if (!x && !y) {
                    return 0;
                } else if (x < y || !x) {
                    return -1;
                } else if (x > y || !y) {
                    return 1;
                } else {
                    return sortAllColumns(colIndex + 1);
                };
            };
            return sortAllColumns(0);
        });

        let fileNum = 0;
        let splitFilesLen = splitFiles.length - 1;
        while (fileNum < splitFilesLen) {
            const a = splitFiles[fileNum].toString().replace(/\/$/, "");
            const b = splitFiles[fileNum + 1].toString().replace(/\/$/, "");

            if (a === b) {
                splitFiles.splice(fileNum, 1);
                splitFilesLen = splitFilesLen - 1;
            } else if (a.length < b.length && a === b.substring(0, a.length)) {
                splitFiles.splice(fileNum, 1);
                splitFilesLen = splitFilesLen - 1;
            } else if (a.length > b.length && a.substring(0, b.length) === b) {
                splitFiles.splice(fileNum + 1, 1);
                splitFilesLen = splitFilesLen - 1;
            } else {
                fileNum++;
            };
        };

        const output = document.getElementById("output");
        if (output) {
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            };

            let lastNode;
            let spanNode = 1;

            for (j = 0; j < maxPath; j++) {
                for (i = 0; i < splitFiles.length; i++) {

                    let node = document.createElement("div");
                    node.className = "branch";
                    node.style.setProperty("grid-row-start", (i + 1));
                    node.style.setProperty("grid-column", (j + 1) + " / span 1");

                    if (splitFiles[i][j]) {
                        node.innerHTML = splitFiles[i][j];

                        if (lastNode && node.innerHTML === lastNode.innerHTML) {
                            spanNode++;
                            lastNode.style.setProperty("grid-row-end", "span " + spanNode);
                        } else {
                            spanNode = 1;
                            node.style.setProperty("grid-row-end", "span " + spanNode);
                            lastNode = node;
                            output.appendChild(node);
                        };

                    } else {
                        node.classList.add("blank");
                        output.appendChild(node);
                    };
                };
            };
        };
    };
};