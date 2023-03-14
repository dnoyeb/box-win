export default {
  drag: {
    mounted(el: any, binding: any, vnode: any) {
      // 如果传递了false就不启用指令，反之true undefined null 不传 则启动
      if (!binding.value && (binding.value ?? "") !== "") return;
      // 拖拽实现
      const odiv = el?.parentNode?.parentNode;
      el.onmousedown = (eve: any) => {
        odiv.classList.remove('box-win-animate')
        eve = eve || window.event;
        const mx = eve.pageX; //鼠标点击时的坐标
        const my = eve.pageY; //鼠标点击时的坐标
        const dleft = odiv.offsetLeft; //窗口初始位置
        const dtop = odiv.offsetTop;
        const clientWidth = document.documentElement.clientWidth; //页面的宽
        const oWidth = odiv.clientWidth; //窗口的宽
        const maxX = clientWidth - oWidth; // x轴能移动的最大距离
        const clientHeight = document.documentElement.clientHeight; //页面的高
        const oHeight = odiv.clientHeight; //窗口的高度
        const maxY = clientHeight - oHeight; //y轴能移动的最大距离
        document.onmousemove = (e: any) => {
          e.preventDefault;
          const x = e.pageX;
          const y = e.pageY;
          let left = x - mx + dleft; //移动后的新位置
          let top = y - my + dtop; //移动后的新位置
          if (left < 0) left = 0;
          if (left > maxX) left = maxX;
          if (top < 0) top = 0;
          if (top > maxY) top = maxY;

          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
          odiv.style.marginLeft = 0;
          odiv.style.marginTop = 0;
        };
        document.onmouseup = () => {
          odiv.classList.add('box-win-animate')
          document.onmousemove = null;
        };
      };
    }
  },
  resize: {
    mounted(el: any, binding: any, vnode: any) {
      // 如果传递了false就不启用指令，反之true undefined null 不传 则启动
      if (!binding.value && (binding.value ?? "") !== "") return;
      // 给选定的元素绑定name属性 设置name为resize区分只有该元素可以缩放
      el.name = "resize";
      // 记录被修改元素的原始位置大小，以及变更方向
      const pos = { width: 0, height: 0, top: 0, left: 0, x: 0, y: 0, dir: "" };

      // 计算移动距离
      const computedDistance = (pre: any, cur: any): any => {
        return [cur.x - pre.x, cur.y - pre.y];
      };

      //数据重置
      const resetData = () => {
        pos.width = 0;
        pos.height = 0;
        pos.top = 0;
        pos.left = 0;
        pos.x = 0;
        pos.y = 0;
        pos.dir = "";
        document.onmousemove = null;
      };
      // 变更尺寸方法
      const changeSize = (e: any) => {
        // 两个点之间的差值，计算鼠标位移数值
        const [disX, disY] = computedDistance(
          { x: pos.x, y: pos.y },
          { x: e.pageX, y: e.pageY }
        );
        const addWid = pos.width + disX;
        const subWid = pos.width - disX;
        const addHig = pos.height + disY;
        const subHig = pos.height - disY;
        const minX = 200;
        const minY = 200;
        //上下左右的变更方法
        const top = () => {
          if (subHig <= minY) return; //不能小于最小最高
          el.style.height = subHig + "px";
          el.style.top = pos.top + disY + "px";
        }; // 上
        const bottom = () => {
          el.style.height = addHig + "px";
        }; // 下
        const left = () => {
          if (subWid <= minX) return; //不能小于最小宽度
          el.style.width = subWid + "px";
          el.style.left = pos.left + disX + "px";
        }; // 左
        const right = () => {
          el.style.width = addWid + "px";
        }; // 右
        // 变更方位及其修改方法映射
        const doFn: any = {
          'n': top, //上
          's': bottom, //下
          'w': left, //左
          'e': right, //右
          'ne': () => {
            top();
            right();
          }, //右上
          'nw': () => {
            top();
            left();
          }, //左上
          'sw': () => {
            bottom();
            left();
          }, //左下
          'se': () => {
            bottom();
            right();
          } //右下
        };
        doFn[pos.dir]();
      };
      //鼠标按下 触发变更事件
      el.onmousedown = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if (!e.target.className?.includes('resize-')) return;
        const odiv = e.target?.parentNode;
        odiv.classList.remove('box-win-animate')
        const d = e.target.className.split('-')[1]
        pos.width = el.clientWidth;
        pos.height = el.clientHeight;
        pos.top = el.offsetTop;
        pos.left = el.offsetLeft;
        pos.x = e.pageX;
        pos.y = e.pageY;
        pos.dir = d;
        document.onmousemove = changeSize
        document.onmouseup = resetData;
      };
    }
  }
};
