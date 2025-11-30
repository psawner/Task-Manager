document.addEventListener("submit", e => e.preventDefault());

const add_more = document.querySelector(".task_header i");

add_more.addEventListener("click", () => {
    const row = document.querySelector(".task_row").cloneNode(true);
    row.querySelectorAll("input").forEach(input => input.value = "");

    const remove_task = document.createElement("div");
    remove_task.classList.add("remove");

    const newIcon = document.createElement('i');
    newIcon.classList.add('fa-solid', 'fa-xmark');

    remove_task.appendChild(newIcon)

    remove_task.addEventListener("click", () => {
        row.remove();
    });

    row.prepend(remove_task);
    document.querySelector(".listof_tasks").appendChild(row);
})


// post api
const add_task = document.querySelector(".add_task");

add_task.addEventListener("click", async (e) => {
    e.preventDefault();
    let tasks = [];
    const task_row = document.querySelectorAll(".task_row");

    task_row.forEach(row => {
        const title = row.querySelector(".title").value;
        const due_date = row.querySelector(".due_date").value;
        const effort = row.querySelector(".effort").value;
        const importance = row.querySelector(".importance").value;


        if (title && due_date && effort && importance) {
            tasks.push({
                title,
                due_date,
                estimated_hours: Number(effort),
                importance: Number(importance),
                dependencies: []
            });
        }
    });

    try {
        const res = await fetch("http://127.0.0.1:8000/api/tasks/analyze/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tasks)
        })

        const data = await res.json();

        const sorted = data.sort((a, b) => b.score - a.score);

        const cards = document.querySelector(".cards");
        cards.innerHTML = "";

        sorted.forEach((task,index) => {
            const card = document.createElement("div");
            card.classList.add("sorted_task");

            if (index === 0) {
                card.style.boxShadow = "0 4px 6px red"
            } else if (index === 1) {
                card.style.boxShadow = "0 4px 6px orange";
            } else if (index === 2) {
                card.style.boxShadow = "0 4px 6px green";
            } else {
                card.style.boxShadow = "none";
            }

            card.innerHTML = `
            <table class="task_details">
                <tbody>
                    <tr>
                        <th>Title</th>
                        <td>${task.title}</td>
                    </tr>
                    <tr>
                        <th>Due date</th>
                        <td>${task.due_date}</td>
                    </tr>
                    <tr>
                       <th>Effort</th>
                        <td>${task.estimated_hours}</td>
                    </tr>
                    <tr>
                        <th>Importance</th>
                        <td>${task.importance}</td>
                    </tr>
                    <tr>
                        <th>Score</th>
                        <td>${task.score}</td>
                    </tr>
                </tbody>
            </table>
        `;
            cards.appendChild(card);
        })
    } catch (err) {
        console.error("Post Request Error:", err);
    }

})


// get api
const strategySelect = document.querySelector("#strategySelect");

strategySelect.addEventListener("change", async (e) => {
    const strategy = e.target.value;
    if (!strategy) return;

    console.log("Selected strategy:", strategy);


    const cards = document.querySelector(".cards");
    cards.innerHTML = "";

    try {
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/suggest/?strategy=${strategy}`);
        const data = await res.json();

        console.log("GET response:", data);


        data.forEach(task => {
            const card = document.createElement("div");
            card.classList.add("sorted_task");

            card.innerHTML = `
                <table class="task_details">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <td>${task.title}</td>
                        </tr>
                        <tr>
                            <th>Due Date</th>
                            <td>${task.due_date}</td>
                        </tr>
                        <tr>
                            <th>Score</th>
                            <td>${task.score}</td>
                        </tr>
                        <tr>
                            <th>Explanation</th>
                            <td>${task.explanation.reasoning}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            cards.appendChild(card);
        });

    } catch (err) {
        console.error("GET Request Error:", err);
    }
});




