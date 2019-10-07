(function(){
  function myPromise(execute){
    var _this = this;
     _this.resVal = null;
    _this.rejVal = null;
    _this.resArr = [];
    _this.rejArr = [];
    _this.status = 'pending';
    function resolve(val){
      if(_this.status == 'pending'){
        _this.status = 'resolve';
      }
      _this.resVal = val;
        _this.resArr.forEach(function(ele){
          ele();
        });
    }
    function reject(val){
      if(_this.status == 'pending'){
        _this.status = 'reject';
      }
      _this.rejVal = val;
      _this.rejArr.forEach(function(ele){
        ele();
      });
    }
    try {
      execute(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  function returnPromise(retVal, res, rej){
    if(retVal instanceof myPromise){
      retVal.then(function(val){
        res(val)
      }, function(val){
        rej(val);
      });
    }else{
      res(retVal);
    }
  }
  myPromise.prototype.then = function(onfulfilled, onrejected){
    var _this = this;
    if(!onfulfilled){
      onfulfilled = function(val){
        return val;
      }
    }
    if(!onrejected){
      onrejected = function(val){
        throw val;
      }
    }
    var nextPromise = new myPromise(function(res, rej){
      setTimeout(function(){
        if(_this.status == 'resolve'){
          try {
            var nextResVal = onfulfilled(_this.resVal);
           returnPromise(nextResVal, res, rej)
          } catch (error) {
            rej(error);
          }
        }else if(_this.status == 'reject'){
          try {
            var nextRejVal = onrejected(_this.rejVal);
            returnPromise(nextRejVal, res, rej)
          } catch (error) {
            rej(error)
          }
        }else if(_this.status == 'pending'){
          _this.resArr.push(function(){
           try {
            var nextResVal = onfulfilled(_this.resVal);
            returnPromise(nextResVal, res, rej)
           } catch (error) {
             rej(error)
           }
          });
          _this.rejArr.push(function(){
           try {
            var nextRejVal = onrejected(_this.rejVal);
            returnPromise(nextRejVal, res, rej)
           } catch (error) {
             rej(error)
           }
          })
        }
      },0)
    });
   
    return nextPromise;
  }
}());