

fetch('http://localhost:3000/api/tasks/')
    .then(async (response) => {
        const data = await response.json();
        console.log(data)
    })
    .then((data) => {
        console.log(data);
    });