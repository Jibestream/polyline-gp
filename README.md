# polyline-group-parser

This module allows one to extract geojson & kml from a csv file grouped with polyline data.

## Installation

> *Requires node.js v6.2.1*

```
npm install polyline-gp -g
```

## Usage:

```bash
$ polyline-gp --input /file/to.csv --output /file/to/output/folder --group "Group column" --polyline "Polyline column"
```

Lets say you have a CSV like this located at `./my.csv`:

| Group               |  Polyline                 |  Data              |
|---------------------|---------------------------|--------------------|
| Yonge-Dundas-Square |  _omiG``ocNw@gFw@Jc@~BRlC |  Main              |
| City-Hall           |  w_miGbdocN~DmAx@lG}DhA   |  Old City Hall     |
| City-Hall           |  icmiGpzocN{@wGtF_BEjH    |  Toronto City Hall |
  

You can run the command:

```bash
$ polyline-gp -i ./my.csv -o ./some/path
```

This would create an `output` folder in `./some/path` with the formed geojson/kml files inside. Any extra columns would be added as properties to the GIS file.

```
output
  |
  L - City-Hall
  |      |
  |      L - City-Hall.geojson
  |      L - City-Hall.kml
  |
  L - Yonge-Dundas-Square
         |
         L - Yonge-Dundas-Square.geojson
         L - Yonge-Dundas-Square.kml
```

You can change the column names that polyline-gp looks for with the `--group` and `--polyline` arguments

### Arguments

```bash
--input       -i    # [Required] The file location of the csv to parse
--output      -o    # The folder that you want your output to go (Default: "./")
--group       -g    # The column to group the csv file by (Default: "Group")
--polyline    -p    # The column that the polyline exists in (Default: "Polyline")
```
