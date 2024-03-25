'use strict';

class Display {

	draw() {
		let turn = screen%20;
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 1000);

        context.font = "24px sans-serif";
        if (pass == 0) {
        	context.fillText((turn+1)+" / 4組目 ", 0, 128*3+24);;
        }
        else{
        	context.fillText("条件を考えてください " +(turn+1)+" / 4組目 ", 0, 128*3+32*4+24);
        }

        context.fillText((pass+1)+" / 5 セット ", 0, 128*3+32*4+48);

        if (pass==0) {
        	context.fillText("条件は「頭に被り物をしている人」です。", 0, 128*3+32*4+72);
        }

		//画像描画
        let img = new Image();

        var url = location.href;

        if (pass == 0) {
        	img.src = './images/'+4+"/auth_"+(turn)+".png";
        }
        else{
        	img.src = './images/'+(rand[pass-1])+"/auth_"+(turn)+".png";
        }
        
        img.onload = function(){
            context.drawImage(img, 0, 0, imgsize*3+32*4, imgsize*3+32*4);}


	    let i = all_data[pass][1][turn];
	    let tl_limit = 1700;

	    //tl 1条件目は0.5秒の赤枠表示
	    if (pass == 0) {
	    	tl_limit = 1300;
	    }

	    setTimeout(function(){
    	context.strokeStyle = "red";
        context.lineWidth = 7;
        context.strokeRect(i%3*(imgsize+32)+32, Math.floor(i/3)*(imgsize+32)+32, imgsize, imgsize);
    	}, tl_limit);

	    canvas.addEventListener('click', this.onClick, false);
	}

}