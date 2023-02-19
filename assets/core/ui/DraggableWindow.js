class DraggableWindow
{
    static Init(handler, borderless = false)
    {
        if(typeof DraggableWindow.Dragging === 'undefined')
        {
            DraggableWindow.Dragging = false;
            window.addEventListener('mouseup', DraggableWindow.EndDrag);
            window.addEventListener('mousemove', DraggableWindow.Drag);
        }
        
        if(!handler) return;

        var window_id = handler.dataset.handle;
        if(!window_id) return;

        var container_window = document.getElementById(window_id);
        if(!container_window) return;

        handler.addEventListener('mousedown', DraggableWindow.StartDrag);

        container_window.dataset.started = 'false';
        container_window.dataset.draggable = 'true';
        container_window.dataset.borderless = borderless;
        container_window.dataset.offsetparent = handler.dataset.offsetparent;
    }

    static setStartPosition(element)
    {
        var rect = element.getBoundingClientRect();
        var x, y, tx, ty;

        x = rect.x;
        y = rect.y;

        if(element.dataset.offsetparent)
        {
            var offset_container = document.getElementById(element.dataset.offsetparent);
            var offset_rect = offset_container.getBoundingClientRect();

            tx = offset_rect.x;
            ty = offset_rect.y;
        }

        element.style.left = (x - tx) + 'px';
        element.style.top = (y - ty) + 'px';
        element.style.transform = 'unset';
        element.dataset.started = 'true';
    }

    static setZ_index(element)
    {   
        var i = 1;
        var indexed = [];
        var els = document.querySelectorAll('[data-draggable="true"');
        els.forEach(e => 
        {
            if(e.style.zIndex)
            {
                var index = parseInt(e.style.zIndex);
                indexed[index] = e;
            }
        });

        for(var index in indexed)
        {
            var el = indexed[index];
            el.style.zIndex = i;
        }

        element.style.zIndex = i + 1;
    }

    static GetStartPosition(element)
    {
        var style = getComputedStyle(element);
        var tX = 0;
        var tY = 0;

        var transform = element.computedStyleMap().get('transform');
        for(var index in transform)
        {
            var property = transform[index];
            if(property instanceof CSSTranslate)
            {
                if(property.x.value) tX = property.x.value + ((property.x.unit == 'percent') ? '%' : '');
                if(property.y.value) tY = property.y.value + ((property.y.unit == 'percent') ? '%' : '');
            }
        }

        var pos = 
        {
            x: style.left,
            y: style.top,
            translateX: tX,
            translateY: tY
        };
        return pos;
    }

    static StartDrag(e)
    {
        if(!Settings.General.AllowDraggableWindows) return;
        DraggableWindow.Dragging = this;

        this.dataset.startx = e.clientX;
        this.dataset.starty = e.clientY;

        var container_window = document.getElementById(this.dataset.handle);

        DraggableWindow.setZ_index(container_window);
        if(container_window.dataset.started == 'false') DraggableWindow.setStartPosition(container_window);
    }

    static EndDrag()
    {
        DraggableWindow.Dragging = null;
    }

    static ResetPosition(container_window)
    {
        container_window.style.top = '';
        container_window.style.left = '';

        container_window.style.right = '';
        container_window.style.bottom = '';

        container_window.style.transform = '';
        container_window.style.zIndex = '';

        DraggableWindow.setZ_index(container_window);
    }

    static Drag(e)
    {
        if(!DraggableWindow.Dragging) return;

        var el = DraggableWindow.Dragging;
        var container_window = document.getElementById(el.dataset.handle);

        var window_rect = container_window.getBoundingClientRect();

        var currentX = window_rect.x;
        var currentY = window_rect.y;

        var x = e.clientX;
        var y = e.clientY;
        
        var startX = parseInt(el.dataset.startx); 
        var startY = parseInt(el.dataset.starty);

        var diffX = startX - x;
        var diffY = startY - y;

        var offsetX = 0;
        var offsetY = 0;


        var border_width = window.innerWidth;
        var border_height = window.innerHeight;


        if(el.dataset.offsetparent)
        {
            var offset_container = document.getElementById(el.dataset.offsetparent);
            var offset_rect = offset_container.getBoundingClientRect();

            offsetX = offset_rect.x;
            offsetY = offset_rect.y;

            border_width = offset_rect.width;
            border_height = offset_rect.height;
        }

        

        var new_y = currentY - offsetY - diffY;
        var new_x = currentX - offsetX - diffX;

        if(container_window.dataset.borderless == 'false')
        {
            if(new_y < 0) new_y = 0;
            if(new_x < 0) new_x = 0;

            if(new_x + window_rect.width > border_width) new_x = border_width - window_rect.width;
            if(new_y + window_rect.height > border_height) new_y = border_height - window_rect.height;
        }

        container_window.style.top = new_y + 'px';
        container_window.style.left = new_x + 'px';

        container_window.style.right = 'unset';
        container_window.style.bottom = 'unset';

        el.dataset.startx = x;
        el.dataset.starty = y;
    }
}