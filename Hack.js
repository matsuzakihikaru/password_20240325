'use strict';

class Hack {

	draw() {
		let turn = screen%20;//turnは4以上
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 1000);

        context.font = "24px sans-serif";
        if (pass == 0) {
        	context.fillText("表示されている条件を満たす画像をクリックしてください " +(turn-3)+" / 8組目 ", 0, 128*3+32*4+24);
        }
        else{
        	context.fillText("推測した条件を満たす画像をクリックしてください " +(turn-3)+" / 8組目 ", 0, 128*3+32*4+24);
        }

        context.fillText((pass+1)+" / 5 セット ", 0, 128*3+32*4+48);

        if (pass==0) {
        	context.fillText("条件は「前髪で額が隠れている人」です。", 0, 128*3+32*4+72);
        }

		//画像描画
        let img = new Image();
        if (pass == 0) {
        	img.src = './images/'+4+"/auth_"+(turn)+".png";
        }
        else{
        	img.src = './images/'+(rand[pass-1])+"/auth_"+(turn)+".png";
        }

        img.onload = function(){
            context.drawImage(img, 0, 0, imgsize*3+32*4, imgsize*3+32*4);}

	    canvas.addEventListener('click', this.onClick, false);
	}

}