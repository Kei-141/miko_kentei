let data = null //問題データ
let difficulty = null //難易度選択
let finishded = [] //解答済みデータ
let question_num = 0 //現在問題数
let end_flag = false //終了判定
let voice = new Audio() //音声
const q_num = 5 //問題数設定

//問題データロード
const load_data = () => {
    const url = location.protocol + "//" + location.host + "/miko_kentei/kentei/data.json"
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            data = json
        });
}

//開始処理
$(document).on('click', '#start', function() {
    load_data()
    $("#a2").fadeIn()
    $("#a3").fadeIn()
    $("#a4").fadeIn()
    $("#start").attr("id", "a1") 
    $("#a1").text("易しい")
    $("#a2").text("普通")
    $("#a3").text("難しい")
    $("#a4").text("ELITE")
    $("#question").text("問題の難易度を選択してにぇ！")
    $("#a2").prop("disabled", false)
    $("#a3").prop("disabled", false)
    $("#a4").prop("disabled", false)
    difficulty = -1 //難易度選択中
});

//解答処理
$(document).on('click', '#a1', function() {
    if (difficulty == -1) {
        difficulty = 0
        finishded.push([load_next()])
        return
    }
    finishded[question_num - 1].push(1)
    finishded.push([load_next()])
});

$(document).on('click', '#a2', function() {
    if (difficulty == -1) {
        difficulty = 1
        finishded.push([load_next()])
        return
    }
    finishded[question_num - 1].push(2)
    finishded.push([load_next()])
});

$(document).on('click', '#a3', function() {
    if (difficulty == -1) {
        difficulty = 2
        finishded.push([load_next()])
        return
    }
    finishded[question_num - 1].push(3)
    finishded.push([load_next()])
});

$(document).on('click', '#a4', function() {
    if (difficulty == -1) {
        difficulty = 3
        finishded.push([load_next()])
        return
    }
    finishded[question_num - 1].push(4)
    finishded.push([load_next()])
});

//次問題ロード
const load_next = () => {
    let question_selector = null
    check_loop:
    while (true) {
        question_selector = Math.floor(Math.random() * data[difficulty].length)
        if (finishded.length == 0) {
            break
        }
        if (finishded.length == q_num) {
            end_flag = true
            break
        }
        let break_flag = true
        for (i = 0; i < finishded.length; i++) {
            if (question_selector == finishded[i][0]) {
                break_flag = false
            }
        }
        if (break_flag) {
            break check_loop
        }
    }
    if (end_flag != true) {
        $("#a1").text(data[difficulty][question_selector][1][0])
        $("#a2").text(data[difficulty][question_selector][1][1])
        $("#a3").text(data[difficulty][question_selector][1][2])
        $("#a4").text(data[difficulty][question_selector][1][3])
        question_num += 1
        question_text = question_num + "/10問目　" + data[difficulty][question_selector][0]
        $("#question").text(question_text)

        if (data[difficulty][question_selector][0].slice(-6) == "[音声問題]") {
            voice.preload = "auto";
            voice.src = location.protocol + "//" + location.host + "/miko_kentei/kentei/" + data[difficulty][question_selector][5]
            voice.load();
            button_dom = $("<button>", {
                id: "play",
                text: "再生▶",
                type: "button",
                class: "btn kentei-btn",
                css: {"color": "black", "margin": "10px"}
            });
            $("#question").append(button_dom)
        }

        return question_selector
    } else {
        $("#a1").text("終了") //終了処理
        $("#a2").text("問題の解説を表示")
        $("#a3").fadeOut()
        $("#a4").fadeOut()
        $("#a3").prop("disabled", true)
        $("#a4").prop("disabled", true)
        $("#a1").attr("id", "end")
        $("#a2").attr("id", "source")
        let answer_num = 0
        for (i = 0; i < finishded.length; i++) {
            if (finishded[i][1] == data[difficulty][finishded[i][0]][2]) {
                answer_num += 1
                finishded[i].push(1)
            }
            else {
                finishded[i].push(0)
            }
        }
        finishded_text = "正解数は…" + question_num + "問中" + answer_num + "問でした！"
        $("#question").text(finishded_text)
        return
    }
}

//初期化
$(document).on('click', '#end', function() {
    document.location.reload()
});

//解説表示
$(document).on('click', '#source', function() {
    if ($("#description").css("display") == "none") {
        $("#description").fadeIn()
        for (i = 1; i <= q_num; i++) {
            let dom_id = "#s" + i
            let num_dom = $("<p>", {
                text: "問題" + i
            });
            let cor_dom = null
            if (finishded[i][2] == 1) {
                cor_dom = $("<b>", {
                    text: "　〇",
                    css: {"color": "red"}
                });
            } else {
                cor_dom = $("<b>", {
                    text: "　×",
                    css: {"color": "blue"}
                });
            }
            let source_dom = $("<p>", {
                text: data[difficulty][finishded[i - 1][0]][3]
            });
            $(num_dom).append(cor_dom)
            $(dom_id).append(num_dom)
            if (data[difficulty][finishded[i - 1][0]][4] != null) {
                let link_dom = $("<a>", {
                    href: data[difficulty][finishded[i - 1][0]][4],
                    target: "_blank",
                    rel: "noopener",
                    text: "[Link]",
                });
                $(source_dom).append(link_dom)
            }
            $(dom_id).append(source_dom)
        }
    }
});

//再生ボタン
$(document).on('click', '#play', function() {
    voice.play();
});
