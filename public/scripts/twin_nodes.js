const twinNodes = (function(){
    'use strict';

    function createNode(x, y, width, height, type, name, topic){

        width = width < 0 ? -width : width;
        height = height < 0 ? -height : height;

        const div = document.createElement('div');
        
        div.dataset.left = x;
        div.dataset.top = y;
        div.dataset.width = width;
        div.dataset.height = height;
        div.dataset.selected = "false";
        div.dataset.type = type;
        div.dataset.name = name;
        div.dataset.topic = topic || ''

        div.classList.add('node');
        div.setAttribute("style", `left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; background-color: #e6e6e6;`);

        return div;

    }

    function updateNodeRecords(nodes, twinUUID){

        const nodeData = nodes.map(node => {

            return {
                left : node.dataset.left,
                top : node.dataset.top,
                width : node.dataset.width,
                height : node.dataset.height,
                selected : node.dataset.selected,
                type : node.dataset.type,
                name : node.dataset.name,
                topic : node.dataset.topic
            };

        });

        console.log(nodeData);
        console.log(`Posting update to ${window.location.origin}/twins/update/${twinUUID}`);
        fetch(`${window.location.origin}/twins/update/${twinUUID}`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials : 'same-origin',
                body : JSON.stringify( { data : { nodes: nodeData } } )
            })
            .then(res => {
                if(!res.ok){
                    throw res;
                } else {
                    return res.json()
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {

                console.log(`Error saving Digital Twin updates:`, err);

            })
        
        ;

    }

    return {
        create : createNode,
        update : updateNodeRecords
    }

})();