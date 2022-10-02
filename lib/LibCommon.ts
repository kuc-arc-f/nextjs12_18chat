import moment from 'moment';

const LibCommon = {
  /* postgres, date format */
  converDateString: function(value: any){
    try{
      let ret = "";
      let dtObj = new Date(Number(value));
      let dt = moment(dtObj);      
      ret = dt.format("YYYY-MM-DD");
      return ret;
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },
  /**
  * converDatetimeString
  * @param
  *
  * @return string
  */    
  converDatetimeString: function(value: any): string
  {
    try{
      let ret = "";
      let dtObj = new Date(Number(value));
      let dt = moment(dtObj);      
      ret = dt.format("YYYY-MM-DD HH:mm");
      return ret;
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },
  /**
  * getDatetimeArray
  * @param items: array
  *
  * @return array | null
  */      
   getDatetimeArray: function(items: any[]): any
  {
    try{
      const ret: any[] = [];
      items.forEach(function (item: any){
        let dtObj = new Date(item.createdAt);
        let dt = moment(dtObj);      
        let dtStr = dt.format("YYYY-MM-DD HH:mm");        
//console.log(item.createdAt);
        item.dt_str = dtStr;
        ret.push(item);
      });
      return ret;
    } catch (e) {
      console.log(e);
      throw new Error('error, getDatetimeArray');
    }
  },
  /**
  * sendNotify
  * @param
  *
  * @return string | null
  */    
  getBrowserType: function(): string
  {
    let ret = "";
    const agent = window.navigator.userAgent.toLowerCase()

    if (agent.indexOf("msie") != -1 || agent.indexOf("trident") != -1) {
      console.log("ブラウザはInternet Explorerです。")
    } else if (agent.indexOf("edg") != -1 || agent.indexOf("edge") != -1) {
      console.log("ブラウザはEdgeです。")
    } else if (agent.indexOf("opr") != -1 || agent.indexOf("opera") != -1) {
      console.log("ブラウザはOperaです。")
    } else if (agent.indexOf("chrome") != -1) {
//      console.log("ブラウザはChromeです。");
      ret = "chrome";
    } else if (agent.indexOf("safari") != -1) {
      console.log("ブラウザはSafariです。")
    } else if (agent.indexOf("firefox") != -1) {
      console.log("ブラウザはFireFoxです。")
    } else if (agent.indexOf("opr") != -1 || agent.indexOf("opera") != -1) {
      console.log("ブラウザはOperaです。")
    }    
    return ret;
  }
}
export default LibCommon
