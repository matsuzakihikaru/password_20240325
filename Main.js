'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面4->5 ... 11->12 ->20
 	if (0 <= x && x < imgsize*3+32*4 && 0 <= y && y < imgsize*3+32*4 && screen%20 >= 4 && screen%20 <= 11) {

        let sx = -1;
        let sy = -1;

        let x = e.offsetX;
        let y = e.offsetY;

        for (let i = 0; i < 3; i++) {
        	if (32 + (imgsize + 32)*i <= x && x < 32 + (imgsize + 32)*i + imgsize) {
        		sx = i;
        		break;
        	}
        }
        for (let i = 0; i < 3; i++) {
        	if (32 + (imgsize + 32)*i <= y && y < 32 + (imgsize + 32)*i + imgsize) {
        		sy = i;
        		break;
        	}
        }

        if (!(sx >= 0 && sy >= 0)) {
            return;
        } 

 		context.clearRect(0, 0, 1500, 1000);

        let number = sy * 3 + sx;
        answer.push(number);
        screen++;

		var now_time = new Date();
        times.push(String(now_time.getTime()-n_time));
        n_time = now_time;

        if (screen%20 <= 11) {
			let hack = new Hack();
			hack.draw();
        }
        else{
			let pass = Math.floor(screen / 20);
			if (pass == 0 || pass == 7) {
				document.getElementById('next').style.visibility = 'visible';
				next();
				return;
			}

     		//screen%20==12
			window.scrollTo(0,0);
			context.clearRect(0, 0, 1500, 1000);

			condition.style.visibility = 'visible';
			condition.value = "";
			document.getElementById('next').style.visibility = 'visible';

			document.getElementById('confidence').style.display = 'inline';

			context.font = "24px sans-serif";
			let sentences = ["推測した条件を入力し、予測の自信度を選択してください。",
				"条件がまったく分からなかった場合には、「不明」などの単語を入力してください。",			
				"次に進むを押すと正解の条件と認証正解数が表示されます。"]

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}
 		
        }

        return ;
        
 	}

}

//画面更新
function next() {

	//画面更新0->1 ... 3->4
 	if (screen%20 <= 3 & screen<280) {

 		if (screen%20 == 0 & screen/20 == 0) {
 			if (confirm("画像パスワード認証に進んでいいですか？　条件は「頭に被り物をしている人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は自分で推測してください。") == false) {
 				return
 			};
 		}		

 		context.clearRect(0, 0, 1500, 1000);
		let display = new Display();
		display.draw();
 		screen++;

 		document.getElementById('next').style.visibility = 'hidden';

	    window.setTimeout(next, 1800);
		return;
 	}

 	if (screen%20 == 4 & screen<280) {

        n_time = new Date();
 		context.clearRect(0, 0, 1500, 1000);
		let hack = new Hack();
		hack.draw();
		document.getElementById('next').style.visibility = 'hidden';
		return;
 	}

 	if (screen%20 == 12 & screen<280) {
 		let pass = Math.floor(screen / 20);
		if (document.getElementById('confidence').value == 0 && pass!=0 && pass!=7) {
			alert("自信度を選択してください。");
			return
		};

 		if (pass==0 || confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			let correct = all_data[pass][1].slice(4,12);
 			let point4 = 0;
 			let point8 = 0;
 			for (let i=0; i<8; i++) {
 				if (answer[8*pass+i] == correct[i]) {
 					point8++;
 					if (i < 4) {
 						point4++;
 					}
 				}
 			}


 			condition.style.visibility = 'hidden';
 			screen+=8;

 			confs.push(document.getElementById('confidence').value);

 			document.getElementById('confidence').value=0;
 			document.getElementById('confidence').style.display='none';

 			context.clearRect(0, 0, 1500, 1000);
			context.font = "24px sans-serif";
			let sentences = ["正解の条件 : "+all_data[pass][0],
							"認証正解数 "+point8+"/8"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}

			points8.push(point8);
			points4.push(point4);

			if (pass==0) {
				conditions.push("N");
			}
			else{
				conditions.push(condition.value);
			}

 			// return;
 		}

 	if (screen == 100) {

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;

	    //送信データ
	    var dt = [name.value, points8, points4, answer, conditions, rand, rev_rand, times, all_time, confs];
	    var json_data = JSON.stringify(dt);

		fetch("https://script.google.com/macros/s/AKfycbzTa3edfNg5UAPpVcAwFARn1PGZyXocwVKB7GP6QX5P_i3_kJHRYlFTmgVxzqir8TvW-Q/exec" , {
			method: "POST",
			body: json_data,
			mode: 'no-cors',
			headers: {"Content-Type": "application/json"}
		}).then((dat) => {
	    	console.log(dat);
	  	});;

		context.font = "24px sans-serif";
		let sentences = [
			"これで実験は終了です。お疲れ様でした。",
			"確認コードは、「ab32」になります。ランサーズ上の実験後アンケートに回答してください。",
			"確認コードはこのページを閉じると二度と表示出来なくなるので注意してください。",
			"なお、正解の条件は以下のようになります。"];

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+72);
			}

		for (let i = 0; i < 5; i++) {
			var str;
			if (i == 0) {
				str = "頭に被り物をしている人";
			}
			else{
				str = data[rand[i-1]][0];
			}
			context.fillText((i+1)+"セット目の条件："+str+" 認証正解数："+points8[i]+"/8", 0, 24*i+72+120);
		}

		document.getElementById('next').style.visibility = 'hidden';		

 	}

 	}
}
	

// 画面番号
let screen = -1;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.addEventListener('click', onClick, false);
let imgsize = 128;

//認証回答時間
let times = ["N"];
let n_time;

//実験開始時間
var now_time = new Date();
let all_start_time = now_time.getTime();;
//実験総時間
let all_time;

let answer = [];

//実験用データ
let data =[["歯が見えている人", [0, 2, 7, 5, 4, 1, 4, 1, 4, 4, 3, 6]],

	["前髪で額が隠れている人", [8, 7, 8, 1, 0, 5, 3, 6, 5, 4, 1, 7]],

	["背景が緑", [0, 2, 6, 2, 5, 6, 6, 2, 1, 0, 3, 1]],

	["耳に髪がかかっていない(短髪の)人", [1, 6, 4, 6, 2, 6, 8, 6, 8, 0, 8, 5]],

	];

//練習用データ
let p_data = [

	["頭に被り物をしている人", [7, 3, 8, 4, 4, 2, 1, 7, 6, 3, 5, 7]]
	
	];

//random順番
let rand = [0,1,2,3];

//randomの逆対応
let rev_rand = [-1,-1,-1,-1];

for(let i = rand.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = rand[i];
    rand[i] = rand[j];
    rand[j] = tmp;
}

for (let i=0; i<rand.length; i++) {
	rev_rand[rand[i]] = i;
}

let all_data = [p_data[0]];

for (let i=0; i<4; i++) {
	all_data.push(data[rand[i]]);
}

//認証時間
let auth_time = [];


//初期画面
context.font = "24px sans-serif";
context.fillText("テキストボックスにあなたのユーザー名を入れ画面をクリックするかEnterキーを押してください。", 0, 36);

document.getElementById('next').style.visibility = 'hidden';
document.getElementById('next').style.display = 'none';

//確信度
document.getElementById('confidence').style.display = 'none';

//実験参加者の名前
let name = document.getElementById("name");

//推測した条件
let condition = document.getElementById("condition");
condition.style.visibility = 'hidden';

let conditions = [];

//point
let points8 = [];
let points4 = [];

//自信度
let confs = [];

//初期画面の名前入力
name.addEventListener('keypress', function(e){
	//エンターキーを押す
  	if (e.keyCode === 13) {
		name_input();
	}  
});

//名前入力
function name_input() {

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {

 		if (confirm("あなたのユーザー名は「"+name.value+"」でいいですか？")==false) {
 			return;
 		}

		document.getElementById('name').style.visibility = 'hidden';
		document.getElementById('next').style.display = 'inline';

        var now_time = new Date();
 		all_start_time=now_time.getTime();

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 1000);
		context.font = "24px sans-serif";
		let sentences = [
			"画面には9枚の顔画像が表示されます。",
			"最初に4組続けて画像が表示され、その後9枚の内1枚だけに赤枠が一瞬だけ表示されます。",
			"赤枠が表示される画像はある条件(以降画像パスワードとする)を満たすものです。",
			"その後、あなたが行うことは画像パスワードを推測し、9枚の顔画像の中から条件を満たす1枚を選択することです。",
			"9枚の顔画像の中から画像パスワードを最も満たす1枚を選択してください。これを8組行います。",
			"その後、あなたが推測した条件と推測の自信度を回答してください。",
			"ここまでを1セットとして、5セットの実験を行います。画像パスワードの条件はセットごとに異なります。",
			"なお、1セット目のみ、ヒントとして、画像パスワードが与えられています。",
			"説明を理解したら、画面上部の「次に進む」をクリックして実験を開始してください。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}

		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}