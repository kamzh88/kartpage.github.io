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
                    const title = data.map((data) => {
                        return data.title.trim();
                    })
                    const summary = data.map(data => {
                        return data.summary.trim();
                    })
                    const link = data.map(data => {
                        return data.link;
                    })
                    for (let i = 0; i < data.length; i++) {
                        // data.forEach(data => {
                        articles.append(`
                        <div class="card-header" id="heading${i}>
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">${title[i]}</button>
                            </h2>
                        </div>
                        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                            <div class="card-body">
                                ${summary[i]}<br>
                                <a href='https://www.infoworld.com${link[i]}'>Article Link</a><br><br>
                            </div>
                        </div>
                        `);
                    }
                });
            });
        });
    });




    //save note button
    $(document).on("submit", "#saveNote", (event) => {
        event.preventDefault()
        console.log('hi');
    });

});