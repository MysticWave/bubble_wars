class CustomSelect
{
    static Init(element, parent_id)
    {
        var id = element.id;
        var options = [];
        var onchange = element.onchange;

        var childs = element.childNodes;
        var i = 0;
        var selected = 0;
        childs.forEach(e => 
        {
            if(e.nodeName == 'OPTION')
            {
                var opt = {value: e.value, name: e.innerText, disabled: e.disabled};
                options.push(opt);
                if(e.selected) selected = i;
                i++;
            }
        });

        var custom = CustomSelect.Create(id, options, selected, onchange);
        element.remove();
        document.getElementById(parent_id).appendChild(custom);
    }

    static Create(id, options = [], selected = 0, onchange = null)
    {
        var container = document.createElement('div');
            container.className = 'custom-select';
            container.id = id;
            container.setAttribute('tabindex', '-1')
            container.dataset.active = 'false';
            if(onchange) container.onchange = onchange;
            container.addEventListener('blur', function()
            {
                this.dataset.active = 'false';
            });
            container.addEventListener('click', function()
            {
                if(this.dataset.active == 'false')
                {
                    this.dataset.active = 'true';
                    this.focus();
                }
                else
                {
                    this.blur();
                }
            });

        var container_name = document.createElement('span');
            container_name.className = 'name';
            container.appendChild(container_name);

        var options_container = document.createElement('div');
            options_container.className = 'options-container';
            container.appendChild(options_container);

        for(var i = 0; i < options.length; i++)
        {
            var opt = options[i];

            var option = document.createElement('div')
                option.className = 'option';
                option.dataset.value = opt.value;
                option.dataset.name = Lang.Get(opt.name) || opt.value;
                option.innerHTML = option.dataset.name;
                if(opt.icon) option.dataset.icon = opt.icon;
                if(opt.disabled) option.dataset.disabled = 'true';
                option.dataset.id = id;
                option.addEventListener('click', function()
                {
                    var container = document.getElementById(this.dataset.id);
                    if(container.dataset.value != this.dataset.value)
                    {
                        container.dataset.value = this.dataset.value;
                        container.value = container.dataset.value;
                        container.querySelector('.name').innerHTML = this.dataset.name;
                        container.onchange();  
                    }
                });

            if(selected == i)
            {
                container.dataset.value = opt.value;
                container.value = container.dataset.value;
                container_name.innerHTML = Lang.Get(opt.name) || opt.value;
            }

            options_container.appendChild(option);
        }

        return container;
    }
}