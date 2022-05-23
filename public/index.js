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
                }
            };

            splitFiles.push(splitPath);

            if (splitPath.length > maxPath) {
                maxPath = splitPath.length;
            };
        };

        for (let i = maxPath - 1; i > 0; i--) {
            sortArray(splitFiles, i);
        };

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

        console.log(splitFiles);

        const output = document.getElementById("output");
        if (output) {
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            };

            for (i = 0; i < splitFiles.length; i++) {
                for (j = 0; j < maxPath; j++) {
                    let node = document.createElement("div");
                    node.className = "branch";
                    node.style.cssText = "grid-row: " + (i + 1) + " / span 1";
                    if (splitFiles[i][j]) {
                        node.innerHTML = splitFiles[i][j];
                    } else {
                        node.classList.add("blank-branch");
                    };
                    output.appendChild(node);
                };
            };
        };
    };
};

const sortArray = (array, column) => {
    array.sort(sortFunction);

    function sortFunction(a, b) {
        if (a[column] === b[column]) {
            return 0;
        } else {
            return (a[column] < b[column]) ? -1 : 1;
        };
    };
};