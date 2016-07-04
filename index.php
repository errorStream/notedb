<html>
<head>
    <!-- Support Sources -->
    <script src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
    <script src="webmidi-2.0.0-alpha.6/src/webmidi.js" type="application/javascript"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css" type="text/css">
    <script src="main.js" type="application/javascript"></script>
</head>
<body>
<?php
    include "functions.php";
?>
    <div class="commonOption">
        <span>Scale:</span>
        <select id="scale-select">
            <option value="major" selected="selected">Major</option>
            <option value="n-minor">Natural Minor</option>
            <option value="h-minor">Harmonic Minor</option>
            <option value="m-minor">Melodic Minor</option>
        </select>
        <span class="hidden">
            <span>MIDI Input:</span>
            <select id="midi-in-select">
                <option value="0" selected="selected">None</option>
            </select>
        </span>
    </div>
    <div>
        <div class="row">
            <?php
            $colCount = 3;

            $colWidth = 12/$colCount;
            $colWidth = floor($colWidth);
            $colString = "";
            $blockArray = makeBlocks();
            for($i=0;$i<$colCount;$i++){
                $colString .= '<div class="col-md-'.$colWidth.'" id="area'.$i.'">';
                for($j=$i;$j<sizeof($blockArray);$j+=$colCount)
                    $colString .= $blockArray[$j];
                $colString .= '</div>';
            }
            echo $colString;
            ?>
        </div>
    </div>
    <script>
        end();
        update(60,jQuery("#scale-select").val());
    </script>
</body>
</html>


