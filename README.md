# Visualize Data with a Choropleth Map

Challenge for the "Data Visualization" module of FreeCodeCamp

---

## User stories

- #**01**: My choropleth should have a title with a corresponding `id="title"`.
- #**02**: My choropleth should have a description element with a corresponding `id="description"`.
- #**03**: My choropleth should have counties with a corresponding `class="county"` that represent the data.
- #**04**: There should be at least 4 different fill colors used for the counties.
- #**05**: My counties should each have `data-fips` and `data-education` properties containing their corresponding `fips` and `education` values.
- #**06**: My choropleth should have a county for each provided data point.
- #**07**: The counties should have `data-fips` and `data-education` values that match the sample data.
- #**08**: My choropleth should have a legend with a corresponding `id="legend"`.
- #**09**: There should be at least 4 different fill colors used for the legend.
- #**10**: I can mouse over an area and see a tooltip with a corresponding `id="tooltip"` which displays more information about the area.
- #**11**: My tooltip should have a `data-education` property that corresponds to the `data-education` of the active area.

## JSON Data:

Here are the datasets you will need to complete this project:

**US Education**

https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json

```json
[
  {
    "fips": 1001,
    "state": "AL",
    "area_name": "Autauga County",
    "bachelorsOrHigher": 21.9
  },
  {
    "fips": 1003,
    "state": "AL",
    "area_name": "Baldwin County",
    "bachelorsOrHigher": 28.6
  },
  {
    "fips": 1005,
    "state": "AL",
    "area_name": "Barbour County",
    "bachelorsOrHigher": 13.6
  },
  {
    "fips": "... continue ..."
  }
]
```

**US County**

https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json

```json
{
  "type": "Topology",
  "objects": {
    "counties": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "id": 5089,
          "arcs": [[0, 1, 2, 3, 4]]
        },
        {
          "type": "Polygon",
          "id": 6079,
          "arcs": [[5, 6, 7, 8, 9]]
        },
        {
          "type": "Polygon",
          "id": "... continue ..."
        }
      ]
    }
  }
}
```
