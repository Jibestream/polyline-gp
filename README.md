# polyline-group-parser

This module allows one to extract geojson & kml from a csv file grouped with polyline data.

> *Requires node.js v6.2.1*

## Usage:

```bash
$ polyline-gp --input /file/to.csv --output /file/to/output/folder --group "Group column" --polyline "Polyline column"
```

Lets say you have a CSV like this located at `./my.csv`:

| Group               |  Polyline                 |  Data              |
|---------------------|---------------------------|--------------------|
| Yonge-Dundas Square |  _omiG``ocNw@gFw@Jc@~BRlC |  Main              |
| City Hall           |  w_miGbdocN~DmAx@lG}DhA   |  Old City Hall     |
| City Hall           |  icmiGpzocN{@wGtF_BEjH    |  Toronto City Hall | 
  

You can run the command:

```bash
$ polyline-gp -i ./my.csv
```

This would create an output folder in your current directory with the formed geojson/kml files inside. Any extra columns would be added as properties to the GIS file.

You can change the column names that polyline-gp looks for with the `--group` and `--polyline` arguments

### Arguments

```bash
--input       # [Required] The file location of the csv to parse
--output      # The folder that you want your output to go (Default: "./")
--group       # The column to group the csv file by (Default: "Group")
--polyline    # The column that the polyline exists in (Default: "Polyline")
```
