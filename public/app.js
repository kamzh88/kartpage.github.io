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
                    const articles = $("#articles");
                    data.forEach(data => {
                            articles.append(`
                            ${data.title}<br>
                            ${data.summary}<br>
                            <a href='https://www.infoworld.com${data.link}'>Article Link</a><br><br>
                            `);
                    });
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