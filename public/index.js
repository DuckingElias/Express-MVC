let buttons = document.getElementsByTagName("button");
for(let i = 0; i < buttons.length; i++) {
    let button = buttons.item(i);
    button.addEventListener("click", function(event) {
        let id = button.getAttribute("data-id");
        let type = button.getAttribute("data-type");
        if(type === "delete") {
            fetch("/", {
                method: "delete",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: id})
            }).then(r => {
                location.reload();
            });
        } else if(type === "update") {
            window.location.href = "edit/" + id;
        }
    });
}

document.getElementById("new").addEventListener('click', event => {
  window.location.href = "edit";
});