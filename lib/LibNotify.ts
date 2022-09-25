//
const LibNotify = {
  /**
  * validNotification
  * @param key: string
  *
  * @return
  */  
  validNotification: function(): void
  {
    try{
      if (!('Notification' in window)) {//対応してない場合
        alert('未対応のブラウザです');
      }
      else {
        // 許可を求める
        Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {// 許可
          }
          else if (permission == 'denied') {// 拒否
            console.log("error, requestPermission = denined");
//            $("#message_index_flash_wrap").css('display','inherit');
//            $("#message_index_flash").text("ブラウザ通知を許可に設定すると。自動更新の通知を受信できます。");
          }
          else if (permission == 'default') {// 無視
          }
console.log(permission);
        });
      }      
    } catch (e) {
      console.log(e);
      throw new Error('error, validNotification');
    }
  },
  /**
  * displayNotification
  * @param title: string
  *
  * @return
  */   
  displayNotification(title: string, body: string ): void
  {
    try {
      if (!('Notification' in window)) {//対応してない場合
        alert('未対応のブラウザです');
      }
      else {
        // 許可を求める
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {// 許可
            var options ={
              body: body,
              //icon: 'https://hoge/pwa/images/icon2.png',					                    
              tag: ''
            };
            var n = new Notification(title,options);
            console.log(n);
//            setTimeout(n.close.bind(n), 5000);
            setTimeout(n.close.bind(n), 10 * 1000);
          }
          else if (permission == 'denied') {// 拒否
          }
          else if (permission == 'default') {// 無視
          }
        });
      }      
    } catch (e) {
      console.log(e);
      throw new Error('error, display_notification');
    }
  }
}
export default LibNotify;
