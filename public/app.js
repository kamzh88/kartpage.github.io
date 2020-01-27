$(document).ready(() => {

    $(document).on("click", ".scrape", (event) => {
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
                    console.log(data);
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
                                <button data-id=${data[i]._id} class="add-notes">Notes</button>
                            </div>
                        </div>
                        `);
                    }
                });
            });
        });   
    });

    $(document).on("click", `.add-notes`, (event) => {
        const thisID = $(event.target)[0].dataset.id;
        console.log(event.target.dataset.id);
        console.log(thisID);
    });



    //save note button
    // $(document).on("submit", "#saveNote", (event) => {
    //     event.preventDefault()
    //     console.log('hi');
    // });

});