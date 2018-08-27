

;(function($){
  var defaults = {
    index:0,                                                   
    paperIndex:0,                                               
    size:0,                                                     
    time:2000,                                                  
    SwiperPaperStyle : {},
  };
  var Swiper = function(elem,options){                          
    this.size = options.swiper.length;                          
    this.time = options.time || 2000;                           
    this.sTime = null;                                          
    this.index = options.index || 0;                            
    this.paperIndex = options.index || 0;                       
    this.init(elem,options);
  };
  Swiper.prototype = {
    init:function(elem,options){
      this.Element(elem,options);
      $(elem).find('.SwiperList').css({width:this.wid(elem) * (this.size + 1)});
      this.mouse(elem,options);
      this.setInterval(elem,options);
    },
    Element:function(elem,options){     
      $(elem).css({ 'width':'100%','overflow': 'hidden','position': 'relative','touch-action': 'none'});   
			var bottom = options.SwiperPaperStyle.bottom || '10px;'
			var tags = '';
      tags = '<!-- qiao 2018/7/5 不需要设置滚动容器的高度，高度由滚动图片自行撑开，宽度随滚动容器上一级宽度。滚动容器为本注释上一级节点 -->'
             +    '<div class="SwiperContent" style=" width: 100%;height: 100%;display: flex;">'
             +       '<div class="SwiperList" style="display: flex;width: 100%;align-items: center;flex-shrink: 0;height: 100%;position: relative;left:0;top:0;">'
             +         this.swperEle('img',options,elem)
             +       '</div>'
             +     '</div>'
             +     '<div class="SwiperPaper" style=" display: flex;width: 100%;justify-content: center;align-items: center;position: absolute;left: 0;bottom:' + bottom + ';}">'
             +       this.swperEle('span',options,elem)
             +     '</div>';
      $(elem).append(tags);
      $(elem).find('.SwiperPaper span').css({ 'cursor': 'pointer','width': (options.SwiperPaperStyle.width || '25px'),'height': (options.SwiperPaperStyle.height || '5px'),'margin-left': '5px','border-radius': '8px'});
      $(elem).find('.SwiperPaper span').eq(options.index).css({ 'background': options.SwiperPaperStyle.activeBg || '#fb513a'}).siblings('span').css({ 'background': options.SwiperPaperStyle.bg ||'#eee'});

    },
    swperEle:function(element,options,elem){    
      let ele = '';
      if(element == 'img'){
        for(let i of options.swiper){
          ele += "<img style='width: " + this.wid(elem) +"px;' src='" + i + "' />"
        }
        ele += "<img style='width: " + this.wid(elem) +"px;' src='" + options.swiper[0] + "' />"
      }else{
        for(let i in options.swiper){
          if(i == options.index){
            ele += "<span class='on'></span>"
          }else{
            ele += "<span></span>"
          }
        }
      }
      return ele;
    },
    wid:function(elem){ 
      return $(elem).width();
    },
    current:function(elem){ 
      if(this.index >= this.size + 1){
        $(elem).find('.SwiperContent .SwiperList').css({'left':'0px'});
        this.index = 1;
      }
      if(this.index >= this.size) this.paperIndex = 0;
        this.move(elem);
    },
    setInterval:function(elem,options){    
      var self = this;
      this.sTime = setInterval(function(){
        self.index = self.index+1;
        self.paperIndex = self.paperIndex+1;
        self.current(elem,options);
      },this.time);
    },
    mouse:function(elem,options){ 
      var self = this;
      var time =  0;      
      $(elem).mouseenter(function(es){   
      	
        time = Date.parse(new Date());
        clearInterval(self.sTime);    
        self.sTime = null;             
        $('.SwiperPaper span').mouseenter(function(em){    
            em.preventDefault();
            $(elem).find('.SwiperContent .SwiperList').stop();
            time = Date.parse(new Date());
            let index = $(this).index();      
            self.index = index;               
            self.paperIndex = index;          
            self.move(elem);                 
          })
      });
      $(elem).mouseleave(function(){     
        if(Date.parse(new Date()) - time >= 500){  
            self.index = self.index + 1;
            self.paperIndex = self.paperIndex + 1;
            self.current(elem,options);
        }
        time = 0;                                    
        self.setInterval(elem,options);                 
      });
    },
    move:function (elem) {                           
      $(elem).find('.SwiperPaper span').eq(this.paperIndex).css({ 'background': '#fb513a'}).siblings('span').css({ 'background': '#eee'});
      $(elem).find('.SwiperContent .SwiperList').stop().animate({'left':(-(this.index*this.wid(elem)) + 'px')});
    }
  };
  $.fn.Swiper = function(options){
    new Swiper(this,$.extend({},defaults,options));
  }
})(jQuery);