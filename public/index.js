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
        let splitFilesLength = splitFiles.length - 1;
        while (fileNum < splitFilesLength) {
            const a = splitFiles[fileNum].toString().replace(/\/$/, "");
            const b = splitFiles[fileNum + 1].toString().replace(/\/$/, "");

            if (a === b) {
                splitFiles.splice(fileNum, 1);
                splitFilesLength = splitFilesLength - 1;
            } else if (a.length < b.length && a === b.substring(0, a.length)) {
                splitFiles.splice(fileNum, 1);
                splitFilesLength = splitFilesLength - 1;
            } else if (a.length > b.length && a.substring(0, b.length) === b) {
                splitFiles.splice(fileNum + 1, 1);
                splitFilesLength = splitFilesLength - 1;
            } else {
                fileNum++;
            };
        };

        console.log(splitFiles);
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