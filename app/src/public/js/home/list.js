var db = [];
fetch("list", {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((res) => res.json())
    .then((data) => db = data);
