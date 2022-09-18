//
const LibStorage = {
  /**
  * set_exStorage
  * @param key: string
  * @param message: string
  *
  * @return
  */  
  set_exStorage(key: string, message: any){
    if(typeof window !== 'undefined' ){
      localStorage.setItem( key, JSON.stringify(message))
    }
  },
  /**
  * get_exStorage
  * @param key: string
  *
  * @return
  */  
  get_exStorage(key: string): any
  {
//    let ret = []
    let ret = null;
    if(typeof window !== 'undefined' ){
      const dat = JSON.parse(localStorage.getItem(key) || '[]')
//console.log(dat);
      ret = dat
    }
    return ret
  },
  remove_exStorage(key: string){
    localStorage.removeItem( key );
  },  
  func1: function(){
    return {
      DB_NAME: "db1",      
    }
  },
}
export default LibStorage;