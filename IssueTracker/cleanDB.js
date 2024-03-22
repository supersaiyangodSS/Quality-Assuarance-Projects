
module.exports = async function (collection) {
  const result = await collection.deleteMany({});
  console.log(`${result.deletedCount} record(s) were deleted from collection ${collection}`);
  const result2 = await collection.drop();
  console.log(`collection ${collection} has been deleted: ${result2}`);
    
  
}