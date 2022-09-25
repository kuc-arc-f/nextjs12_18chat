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
}
export default LibCommon
