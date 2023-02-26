document.addEventListener("DOMContentLoaded", () => {
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // Define the 'request' function to handle interactions with the server
    function server_request(url, data = {}, verb, callback) {
        return fetch(url, {
                credentials: "same-origin",
                method: verb,
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => response.json())
            .then((response) => {
                if (callback) callback(response);
            })
            .catch((error) => console.error("Error:", error));
    }

    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // References to frequently accessed elements
    let main = document.querySelector("main");
    let table = document.querySelector(".table");
    let template = document.querySelector("#new_row");
    let add_form = document.querySelector("form[name=add_user]");
    let edit_form = document.querySelector("form[name=edit_user]");

    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // Handle POST Requests
    add_form.addEventListener("submit", (event) => {
        // Stop the default form behavior
        event.preventDefault();

        // Submit POST request from the add form
        /*
          1. Grab the data from the input fields
          2. Grab the action and method attributes from the form
          3. Submit a server POST request and when the server responds...
            4. Insert a template row into the table
            5. Update the content of the newly added row with the ID, first_name, and last_name of the user
          6. Remove the alert below this comment block
        */
        let formData = new FormData(add_form);
        let url = add_form.getAttribute("action");
        let verb = add_form.getAttribute("method");

        server_request(url, formData, verb, (response) => {
            let row = template.content.cloneNode(true).querySelector(".row");
            row.dataset.id = response.id;
            row.querySelector(".id").innerText = response.id;
            row.querySelector(".first_name").innerText = response.first_name;
            row.querySelector(".last_name").innerText = response.last_name;
            table.appendChild(row);
        });
        alert("Feature is incomplete!");
    });

    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // Handle PUT and DELETE Requests
    main.addEventListener("click", (event) => {
        // Open edit form
        if (event.target.classList.contains("edit_button")) {
            main.dataset.mode = "editing";

            let row = event.target.closest(".row");
            edit_form.querySelector("input[name=first_name]").value =
                row.children[1].innerText.trim();
            edit_form.querySelector("input[name=last_name]").value =
                row.children[2].innerText.trim();
            edit_form.dataset.id = row.dataset.id;
        }

        // Close edit form
        if (event.target.classList.contains("cancel_button")) {
            main.dataset.mode = "viewing";
        }

        // Submit PUT request from the edit form
        /*
          1. Check if the 'save_button' was the clicked element
          2. Retrieve the ID, first_name, and last_name from the edit form
          3. Submit a server PUT request and when the server responds...
            4. Update the row corresponding to this user with the new data if successful
            5. Switch back the main container's mode to 'viewing'
        */

        // Submit DELETE request and delete the row if successful
        /*
          1. Check if the 'delete_button' was the clicked element
          2. Retrieve the ID from the closest row
          3. Submit a server DELETE request and when the server responds...
            4. Remove the row if successful
        */
        // Handle PUT and DELETE Requests
        main.addEventListener("click", (event) => {
            // Open edit form
            if (event.target.classList.contains("edit_button")) {
                main.dataset.mode = "editing";

                let row = event.target.closest(".row");
                edit_form.querySelector("input[name=first_name]").value =
                    row.children[1].innerText.trim();
                edit_form.querySelector("input[name=last_name]").value =
                    row.children[2].innerText.trim();
                edit_form.dataset.id = row.dataset.id;
            }

            // Close edit form
            if (event.target.classList.contains("cancel_button")) {
                main.dataset.mode = "viewing";
            }

            // Submit PUT request from the edit form
            if (event.target.classList.contains("save_button")) {
                event.preventDefault();
                let id = edit_form.dataset.id;
                let first_name = edit_form.querySelector(
                    "input[name=first_name]"
                ).value;
                let last_name = edit_form.querySelector("input[name=last_name]").value;
                let data = { id, first_name, last_name };

                server_request(`/users/${id}`, data, "PUT", (response) => {
                    if (response.success) {
                        let row = document.querySelector(`.row[data-id="${id}"]`);
                        row.children[1].innerText = first_name;
                        row.children[2].innerText = last_name;
                        main.dataset.mode = "viewing";
                    } else {
                        console.error(response.message);
                    }
                });
            }

            // Submit DELETE request and delete the row if successful
            if (event.target.classList.contains("delete_button")) {
                let row = event.target.closest(".row");
                let id = row.dataset.id;

                server_request(`/users/${id}`, {}, "DELETE", (response) => {
                    if (response.success) {
                        row.remove();
                    } else {
                        console.error(response.message);
                    }
                });
            }
        });
    });
});