We will now review the syntax of MPEG-4 scene commands in both BT and XMT-A formats. Please remember that BT and XMT languages are case sensitive.

## Command declaration

### BT format

```
RAP AT time IN esID { .... }
```

`RAP` and `IN esID` can be omitted most of the time.


### XMT format

```xml
<par begin="time" atES_ID="esID" isRAP="yes" > ... </par>
```

`isRAP` and `atES_ID` can be omitted most of the time. `isRAP` is a GPAC extension.

## Replacing a simple field

### BT format
```
REPLACE nodeName.fieldName BY newValue
```
### XMT format
```xml
<Replace atNode="nodeName" atField="fieldName" value="newValue" />
```
## Replacing a SFNode field

### BT format
```
REPLACE nodeName.fieldName BY NodeDeclaration {... }
```
### XMT format
```xml
<Replace atNode="nodeName" atField="fieldName" >
<NodeXXX />
</Replace>
```
Note that the new node can be DEF'ed, or that a null node may be specified (`NULL` ).

## Replacing a value in a multiple field

### BT format
```
REPLACE nodeName.fieldName[idx] BY newValue
```
### XMT format
```xml
<Replace atNode="nodeName" atField="fieldName" position="idx" value="newValue" />
```
For XMT-A, `idx` can also take the special values 'BEGIN' and 'END'. Replacement of a node in an MFNode field is the combination of both syntax

## Replacing a multiple field

### BT format
```
REPLACE nodeName.fieldName BY [value1 ... valueN]
```
```
REPLACE nodeName.fieldName BY [Node { ... } ... Node { ... }]
```
### XMT format
```xml
<Replace atNode="nodeName" atField="fieldName" value="value1 ... valueN" />
```
```xml
<Replace atNode="nodeName" atField="fieldName" >
<NodeXXX>...</NodeXXX>
<NodeXXX>...</NodeXXX>
</Replace>
```
Replacement of a node in an MFNode field is the combination of both syntax

## Deleting a node

### BT format
```
DELETE nodeName
```
```
DELETE nodeName.fieldName
```
### XMT format
```xml
<Delete atNode="nodeName" />
```
```xml
<Delete atNode="nodeName" atField="fieldName" />
```
## Deleting a value in a multiple field

### BT format
```
DELETE nodeName.fieldName[idx]
```
### XMT format
```xml
<Delete atNode="nodeName" atField="fieldName" position="idx" />
```
For XMT-A, `idx` can also take the special values 'BEGIN' and 'END'.

## Inserting a simple value in a multiple field

### BT format
```
INSERT AT nodeName.fieldName[idx] newValue
```
```
APPEND TO nodeName.fieldName newValue
```
### XMT format
```xml
<Insert atNode="nodeName" atField="fieldName" position="idx" value="newValue" />
```
For XMT-A, `idx` can also take the special values 'BEGIN' and 'END'.

## Inserting a node in a node list field

### BT format
```
INSERT AT nodeName.fieldName[idx] Node { }
```
```
APPEND TO nodeName.fieldName Node { }
```
### XMT format
```xml
<Insert atNode="nodeName" atField="fieldName" position="idx" >
<NodeXXX>...</NodeXXX>
</Insert>
```
For XMT-A, `idx` can also take the special values 'BEGIN' and 'END'.

## Replacing a route

### BT format
```
REPLACE ROUTE routeName BY nodeName1.fieldName1 TO nodeName2.fieldName2
```
### XMT format
```xml
<Replace atRoute="routeName">
<ROUTE fromNode="nodeName1" fromfield="fieldName1" toNode="nodeName2" toField="fieldName2" />
</Replace>
```
## Inserting a route

### BT format
```
INSERT ROUTE nodeName1.fieldName1 TO nodeName2.fieldName2
```
### XMT format
```xml
<Insert>
<ROUTE fromNode="nodeName1" fromfield="fieldName1" toNode="nodeName2" toField="fieldName2" />
</Insert>
```
