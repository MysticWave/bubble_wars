class DraggableScroll
{
    static Init(element, info = null)
    {
        DraggableScroll.Dragging = null;
        DraggableScroll.Scrolling = null;
        DraggableScroll.SmoothInterval = null;
        DraggableScroll.Moved = false;

        DraggableScroll.DragStart = 0;
        DraggableScroll.startX = 0;
        DraggableScroll.startY = 0;
        DraggableScroll.startScrollX = 0;
        DraggableScroll.startScrollY = 0;

        DraggableScroll.scrollTick = 0;
        DraggableScroll.scrollDuration = 60;
        DraggableScroll.smoothLeft = 0;
        DraggableScroll.smoothTop = 0;

        if(info)
        {
            if(info.accX) element.dataset.accx = info.accX;
            if(info.accY) element.dataset.accx = info.accY;
            if(info.step) element.dataset.step = info.step;
        }

        element.addEventListener('mousedown', DraggableScroll.MouseDown);
        element.addEventListener('mouseup', DraggableScroll.MouseUp);
        element.addEventListener('mouseenter', DraggableScroll.MouseEnter);
        element.addEventListener('mousemove', DraggableScroll.MouseMove);
    }

    static changeChildsPointers(disable = true)
    {
        if(DraggableScroll.Dragging)
        {
            DraggableScroll.Dragging.dataset.childpointers = (disable) ? 'none' : '';
            // for(var i = 0; i < DraggableScroll.Dragging.childNodes.length; i++)
            // {
            //     var child = DraggableScroll.Dragging.childNodes[i];
            //     if(!child.style) continue;
            //     child.style.pointerEvents = (disable) ? 'none' : '';
            // }
        }
    }

    static MouseEnter()
    {
        DraggableScroll.changeChildsPointers(false);

        DraggableScroll.Moved = false;
        DraggableScroll.Dragging = null;
    }

    static MouseDown(e)
    {
        if(e.button != 0) return;

        DraggableScroll.Moved = false;

        if (e.offsetX > e.target.clientWidth || e.offsetY > e.target.clientHeight) 
        {
            //scrollbar click
            return;
        }

        DraggableScroll.Dragging = this;
        DraggableScroll.DragStart = Date.now();

        DraggableScroll.startX = e.clientX;
        DraggableScroll.startY = e.clientY;

        DraggableScroll.startScrollX = this.scrollLeft;
        DraggableScroll.startScrollY = this.scrollTop;
    }

    static MouseMove(e)
    {
        if(DraggableScroll.Dragging != this) return;


        if(!DraggableScroll.Moved) DraggableScroll.changeChildsPointers();

        DraggableScroll.Moved = true;
        clearInterval(DraggableScroll.SmoothInterval);
        

        var x = e.clientX;
        var y = e.clientY;

        var distanceX = DraggableScroll.startX - x;
        var distanceY = DraggableScroll.startY - y;

        var scrollLeft = DraggableScroll.startScrollX + distanceX;
        var scrollTop = DraggableScroll.startScrollY + distanceY;

        if(this.scrollTop != scrollTop || this.scrollLeft != screenLeft)
        {
            
            DraggableScroll.Scroll(this, scrollLeft, scrollTop); 
        }
    }

    static MouseUp(e)
    {
        if(DraggableScroll.Dragging != this) return;
        DraggableScroll.changeChildsPointers(false);

        var dragTime = Date.now() - DraggableScroll.DragStart;
        var multiplier = (500 / dragTime);
        if(multiplier < 1) multiplier = 1;
        if(multiplier > 15) multiplier = 15;


        var x = e.clientX;
        var y = e.clientY;

        var distanceX = (DraggableScroll.startX - x) * multiplier;
        var distanceY = (DraggableScroll.startY - y) * multiplier;

        var scrollLeft = DraggableScroll.startScrollX + distanceX;
        var scrollTop = DraggableScroll.startScrollY + distanceY;

        if(this.dataset.step)
        {
            var s = parseInt(this.dataset.step);
            scrollLeft = Math.round(scrollLeft / s) * s;
            scrollTop = Math.round(scrollTop / s) * s;
        }

        if(Math.abs(distanceX) > 10 || Math.abs(distanceY) > 10) DraggableScroll.SoftScroll(this, scrollLeft, scrollTop);
        else DraggableScroll.Scroll(this, scrollLeft, scrollTop);

        DraggableScroll.Dragging = null;
    }


    static SoftScroll(element, scrollLeft, scrollTop)
    {
        clearInterval(DraggableScroll.SmoothInterval);

        DraggableScroll.Scrolling = element;
        DraggableScroll.scrollTick = 0;
        DraggableScroll.smoothLeft = element.scrollLeft;
        DraggableScroll.smoothTop = element.scrollTop;

        DraggableScroll.smoothDistanceY = scrollTop - element.scrollTop;
        DraggableScroll.smoothDistanceX = scrollLeft - element.scrollLeft;

        DraggableScroll.SmoothInterval = setInterval(DraggableScroll.SoftScrollUpdate, 1000/60);
    }

    static SoftScrollUpdate()
    {
        if(DraggableScroll.scrollTick > DraggableScroll.scrollDuration)
        {
            clearInterval(DraggableScroll.SmoothInterval);
            DraggableScroll.Scrolling = null;  
            return;
        }

        var p = 1.675;
        var k = (DraggableScroll.scrollTick / DraggableScroll.scrollDuration);
        var acc = 1 - Math.pow(1 - k, p);

        var accX = DraggableScroll.Scrolling.dataset.accx || 1;
        var accY = DraggableScroll.Scrolling.dataset.accy || 1;

        scrollX = DraggableScroll.smoothLeft + (DraggableScroll.smoothDistanceX * acc * accX);
        scrollY = DraggableScroll.smoothTop + (DraggableScroll.smoothDistanceY * acc * accY);

        var scrolled = DraggableScroll.Scroll(DraggableScroll.Scrolling, scrollX, scrollY);
        if(!scrolled && DraggableScroll.scrollTick > 5)
        {
            DraggableScroll.Scroll(DraggableScroll.Scrolling, DraggableScroll.smoothLeft + DraggableScroll.smoothDistanceX, DraggableScroll.smoothTop + DraggableScroll.smoothDistanceY);
            clearInterval(DraggableScroll.SmoothInterval);
            DraggableScroll.Scrolling.style.scrollBehavior = '';
            DraggableScroll.Scrolling = null; 
        }
        DraggableScroll.scrollTick++;

        // if(scrolled && DraggableScroll.scrollTick%5 == 0)
        // {
        //     SoundManager.Play('tick', 'EFFECT');
        // }
    }


    static Scroll(element, scrollLeft, scrollTop)
    {
        var previous = {top: element.scrollTop, left: element.scrollLeft};

        element.scrollLeft = scrollLeft;
        element.style.scrollBehavior = 'unset';
        element.scrollTop = scrollTop;

        if(element.scrollTop == previous.top && element.scrollLeft == previous.left) return false;
        return true;
    }
}