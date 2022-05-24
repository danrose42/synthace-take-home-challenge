// Triggered on click of 'Build Tree' button
const buildTree = () => {

    // Get file list from input textarea
    const input = document.getElementById("input");

    if (input) {

        // Clean input (only allow alphanumeric, underscore, forward slash, line feed,
        // dot or hyphen) and split on line feed to create an array of file paths
        const cleanInput = input.value.replace(/[^\w\/\n.-]/g, "");
        const splitInput = cleanInput.split("\n");

        let splitFiles = [];
        let maxPath = 0;

        // Loop through array of file paths
        for (let i = 0; i < splitInput.length; i++) {
            let path = splitInput[i];

            // Replace any multiple slashes in a row with a single slash 
            path = path.replace(/\/+/g, "/");

            // Add a forward slash to start of the path if not one already
            if (path.charAt(0) !== "/") {
                path = "/" + path;
            };

            // Remove trailing slash from path if it has one
            path = path.replace(/\/$/, "");

            // Split path to create a directory structure array for file
            let splitPath = path.split("/");

            // Add trailing slash back to each array element except last
            for (let i = 0; i < splitPath.length; i++) {
                if (i === 0 || splitPath[i + 1]) {
                    splitPath[i] = splitPath[i] + "/";
                };
            };

            // Append main array to create a 2D directory array for all input files
            splitFiles.push(splitPath);

            // Keep a record of the longest file path in array
            if (splitPath.length > maxPath) {
                maxPath = splitPath.length;
            };
        };


        // Sort 2D array alphabetically from left to right using recursive sort function
        splitFiles.sort((a, b) => {
            const sortAllColumns = (colIndex) => {
                const x = a[colIndex];
                const y = b[colIndex];

                // If both elements don't exist, leave order as is
                if (!x && !y) return 0;

                // If first element higher alphabetically or doesn't exist, move up
                else if (x < y || !x) return -1;

                // If first element lower alphabetically, move down
                else if (x > y || !y) return 1;

                // If elements equal, sort using next column in 2D array
                else return sortAllColumns(colIndex + 1);
            };

            // Start sort using first column (left to right)
            return sortAllColumns(0);
        });


        // Loop through sorted array to deduplicate file paths if identical, or when
        // file path will already be accounted for by longer file path so isn't
        // necessary to build tree - eg. directory '/home/vimes/gear' will already be
        // accounted for by '/home/vimes/gear/helmet' so we can remove the shorter path

        // Variables to keeps track of which elements to evaluate when looping through
        // array as we are using array.splice() method, which completely removes an
        // element from array and so shifts all subsequent elements down an index by 1
        let fileNum = 0;
        let splitFilesLen = splitFiles.length - 1;

        while (fileNum < splitFilesLen) {

            // Change split file paths back to strings to compare
            const a = splitFiles[fileNum].toString().replace(/\/$/, "");
            const b = splitFiles[fileNum + 1].toString().replace(/\/$/, "");

            // If file path is identical to one below, remove it from array
            if (a === b) {
                splitFiles.splice(fileNum, 1);
                splitFilesLen = splitFilesLen - 1;
            }

            // If file path is accounted for by longer path below, remove it
            else if (a.length < b.length && a === b.substring(0, a.length)) {
                splitFiles.splice(fileNum, 1);
                splitFilesLen = splitFilesLen - 1;

            }

            // If file path accounts for shorter path below, remove below path
            else if (a.length > b.length && a.substring(0, b.length) === b) {
                splitFiles.splice(fileNum + 1, 1);
                splitFilesLen = splitFilesLen - 1;
            }

            // Otherwise move on and evaluate next path below
            else {
                fileNum++;
            };
        };


        const output = document.getElementById("output");

        if (output) {

            // Remove any existing child elements from output tree
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            };

            let lastNode;
            let spanNode = 1;

            // Loop over sorted and deduplicated 2D array of file paths column by column
            // (left to right), so that we can compare elements vertically and make div
            // span multiple rows if referring to same directory location
            for (j = 0; j < maxPath; j++) {
                for (i = 0; i < splitFiles.length; i++) {

                    let node = document.createElement("div");
                    node.className = "branch";

                    // Set CSS grid row and column locations for div using array indices 
                    node.style.setProperty("grid-row-start", (i + 1));
                    node.style.setProperty("grid-column", (j + 1) + " / span 1");

                    if (splitFiles[i][j]) {
                        // If array element exists add text to div
                        node.innerHTML = splitFiles[i][j];

                        // If new div text is identical to previous (one above), make
                        // previous div span down another row instead of adding new one
                        if (lastNode && node.innerHTML === lastNode.innerHTML) {
                            spanNode++;
                            lastNode.style.setProperty("grid-row-end", "span " + spanNode);
                        }

                        // Otherwise set new div height to one row, add new div to output
                        // tree, and update 'lastNode' variable to the div just created
                        else {
                            spanNode = 1;
                            node.style.setProperty("grid-row-end", "span " + spanNode);
                            output.appendChild(node);
                            lastNode = node;
                        };
                    }

                    // If array element does not exist append a 'blank' div to tree
                    else {
                        node.classList.add("blank");
                        output.appendChild(node);
                    };
                };
            };
        };
    };
};