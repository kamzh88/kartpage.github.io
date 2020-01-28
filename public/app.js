$(document).ready(() => {

    $(document).on("click", ".scrape", (event) => {
        $(".accordion").empty();
        $.ajax('/articles', {
            type: "DELETE",
        }).then(() => {
            // console.log("Deleted");
            $.ajax('/scrape', {
                type: "GET",
            }).then((result) => {
                // console.log(result);
                $.getJSON("/articles", data => {
                    const articles = $(".accordion");
                    // console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        articles.append(`
                        <div class="card-header" id="heading${i}>
                            <h2 class="mb-0">
                                <button class="btn btn-link titleCSS" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">${data[i].title.trim()}</button>
                            </h2>
                        </div>
                        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                            <div class="card-body">
                                ${data[i].summary.trim()}<br><br>
                                <a href='https://www.infoworld.com${data[i].link}'>Article Link</a>
                                <button data-id=${data[i]._id} class="add-notes">Comments</button>
                            </div>
                        </div>
                        `);
                    }
                });
            });
        });
    });

    $(document).on("click", `.add-notes`, (event) => {
        $(".note").empty();
        const thisID = $(event.target)[0].dataset.id;
        console.log(thisID);
        const noteDiv = $(".note");
        noteDiv.append(`
        <form class="saveNote" data-id="${thisID}">                
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" id="title">
            </div>
            <div class="form-group">
                <label for="note">Comment:</label>
                <textarea class="form-control" rows="5" id="note"></textarea>
            </div>
            <button type="submit"  value="Submit">Submit</button>
        </form>
        `);
        $.ajax({
            method: "GET",
            url: "/articles/" + thisID
        }).then(data => {
            console.log(data);
        })
    });

    $(document).on("submit", `.saveNote`, (event) => {
        event.preventdefault();
        const thisID = $(event.target)[0].dataset.id;
        console.log(thisID);
        // app.post("/articles/:id", (req, res) => {

        // })
    });
});