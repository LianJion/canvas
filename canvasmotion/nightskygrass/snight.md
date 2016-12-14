#### 长草诗篇
*1* [冉冉升起的writing-mode](http://www.zhangxinxu.com/wordpress/2016/04/css-writing-mode/)

    //自己用了下面这句
     writing-mode: tb-rl; 

    /* 关键字值 */
    writing-mode: horizontal-tb;    /* 默认值 */
    writing-mode: vertical-rl;
    writing-mode: vertical-lr;

    /* 全局值-关键字inherit IE8+，initial和unset IE13才支持 */
    writing-mode: inherit;
    writing-mode: initial;
    writing-mode: unset;

    //兼容ie8,那么就用以下的
    writing-mode: lr-tb | tb-rl | tb-lr (IE8+);
    writing-mode: horizontal-tb | vertical-rl | vertical-lr;

* 尤其像中国这样的东亚国家，存在文字的排版不是水平式的，而是垂直的，例如中国的古诗古文

* 例子如下 [夜风吹萤](https://lianjion.github.io/webshow/nightskygrass/snight.html)


