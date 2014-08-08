About the Integration Guides.
These guides are built with a templating system based on jquery and JSON files.
The basic format for the content is provided by the files
_gridcell.tmp.htm_product.tmp.htm_productexample.tmp.htm
These are essentially chunks of HTML with class names and IDs that allow the render() script to insert content at the right places. 

All the relevant content for each product and examples: text, links to images, links to installers, etc is contained in the 'product_dbase_[controllername].JSON' files. There are key-value pairs for the software titles and examples that fill out the content for the templates.

The actual guide files are the "[controllername].html" which are really unique only in the assignment of the variable PNAME (product name) that assigns that page the correct database and header image. I'm sure this could be continually refined, but you gotta stop somewhere.

If there needs to be any changes to the content, edit the JSON files. You can load them up in a text editor, but you might find that using a GUI tool like
http://www.jsoneditoronline.org
or 
http://jsoneditor.net
Just cut-and-pass the contents of the product_dbase.json file into the editor, make changes, then paste the modified json into the product_dbase file. 

