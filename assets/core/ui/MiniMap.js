class MiniMap
{
    static Init()
    {
        
    }


    static drawPoint(x, y, data, isActiveMapTile = false)
    {
        var container = document.getElementById('world_map_points');
        var rank = data.rank ?? '';
        var abs_rank = rank.replace('+', '').replace('-', '').toLowerCase();

        var p = document.createElement('div');
            p.className = 'point text-stroke';
            p.style.top = y + 'px';
            p.style.left = x + 'px';
            p.innerText = rank;
            p.dataset.location_id = data.id;
            p.dataset.name = data.name;
            p.dataset.inactivehex = isActiveMapTile;
            if(data.specialIcon)
            {
                p.dataset.icon = data.specialIcon;
                p.className += ' icon';
            }

            p.style.setProperty('color', 'var(--color-rank-' + abs_rank + ')');
            if(data.isCurrent) p.dataset.current = 'true';

            p.dataset.village = data.isVillage;
            p.dataset.cleared = data.isCleared;
            p.dataset.locationfamily = data.id.toLowerCase().replace(/[0-9]/, '').replace(' ', '');
            if(!data.canInteract) p.style.pointerEvents = 'none';
            else
            {
                p.addEventListener('click', function()
                {
                    var result = Commands.GoToLocation(this.dataset.location_id);
                    if(result == true)
                    {
                        UI_Helper.Hide('#world_map');
                    }
                    else
                    {
                        console.error(result);
                    }
                });
            }

        container.appendChild(p);

        this.LOCATION_POINTS_HISTORY[data.id] = {x, y, cleared: data.isCleared};
    }




    static Render()
    {
        
    }
}