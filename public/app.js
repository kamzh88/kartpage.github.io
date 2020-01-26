$(document).ready(() => {

    $.getJSON("/articles", data => {
        const articles = $("#articles");

        data.forEach(data => {
            articles.append(`
            ${data.title}<br>
            ${data.summary}<br>
            <a href='https://www.infoworld.com${data.link}'>Article Link</a><br><br>
            `);
        });
    })

});