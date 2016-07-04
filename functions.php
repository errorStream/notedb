<?php

function makeTable($x,$y){
    $retData = '<table class="content-grid">';
    for($i=0;$i<$y;$i++){
        $retData.="<tr>";
        for($j=0;$j<$x;$j++){
            $retData.="<td id=\"$j-$i\">";
            $retData.="</td>";
        }
        $retData.="</tr>";
    }
    $retData.="</table>";
    return $retData;
}

function GUIStyle($idText){
    $spacedText = preg_replace_callback("/[A-Z]/",function($matches){
        return " ".$matches[0];
    },$idText);
    $uppedText = ucwords($spacedText);
    return $uppedText;
}

function startBlock($id){
    return '<div class="module" id="mod_'.$id.'">';
}

function endBlock(){
    return '</div>';
}

function makeTitle($title){
    return '<h2 class="mod-title">'.GUIStyle($title).'</h2>';
}

function makeRow_section($rowDat){
    return "";
}

function makeRow_imgMatrix($rowDat){
    return ""; // TODO
}

function makeRow_text($rowDat){
    return '<span class="adjustable-text" id="adjustable_'.$rowDat["title"].'_'.$rowDat["label"].'"></span>';
}

function makeRow($rowData){
    $retVal = '<table class="mod-table rowStyle-'.$rowData["type"].'" id="row_'.$rowData["label"].'"><tbody>';
    if(array_key_exists("GUILabel",$rowData)){
        $displayLabel = $rowData["GUILabel"];
    }
    else{
        $displayLabel = GUIStyle($rowData["label"]);
    }
    $retVal .= '<tr>';
    $retVal .= '<td>'.$displayLabel.'</td>';
    $retVal .= '<td>'.call_user_func("makeRow_".$rowData["type"],$rowData).'</td>';
    $retVal .= '</tr>';
    $retVal .= '</tbody></table>';
    return $retVal;
}

function thisDir(){
    return dirname(__FILE__)."/";
}

function makeBlocks(){
    $mods = json_decode(file_get_contents(thisDir()."mods.json"),true);
    $blockArr = array();
    foreach($mods as $blockData){
        $blockStr = "";
        $blockStr .= startBlock($blockData["title"]);
        $blockStr .= makeTitle($blockData["title"]);
        foreach($blockData["rows"] as $row){
            $row["title"] = $blockData["title"];
            $blockStr .= makeRow($row);
        }
        $blockStr .= endBlock();
        array_push($blockArr,$blockStr);
    }
    return $blockArr;
}
