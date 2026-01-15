import { useState, useEffect } from "react";
import { Tag } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { getTags, saveTag, deleteTag } from "@/utils/firestore";

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] = useState("fabric"); // default
  const [newTagColor, setNewTagColor] = useState("#000000");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const newTag = {
        name: newTagName,
        category: newTagCategory,
        colorHex: newTagCategory === 'color' ? newTagColor : null
      };
      
      await saveTag(newTag);
      setNewTagName("");
      fetchTags(); // Refresh list
    } catch (error) {
      console.error("Error adding tag:", error);
      alert("Failed to add tag");
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      await deleteTag(id);
      setTags(tags.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const categories = ["fabric", "color", "occasion", "style", "dressType"];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-6 mt-4 mb-20">
      <h2 className="text-xl font-bold">Manage Attributes (Tags)</h2>

      {/* Add Tag Form */}
      <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row flex-wrap gap-4 items-end border-b pb-6">
        <div className="space-y-2 w-full sm:w-auto sm:flex-1">
          <Label>Category</Label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newTagCategory}
            onChange={(e) => setNewTagCategory(e.target.value)}
          >
            <option value="fabric">Fabric</option>
            <option value="color">Color</option>
            <option value="occasion">Occasion</option>
            <option value="style">Style</option>
            <option value="dressType">Dress Type</option>
          </select>
        </div>

        <div className="space-y-2 w-full sm:w-auto sm:flex-[2]">
          <Label>Name</Label>
          <Input 
            placeholder="e.g. Silk, Red, Wedding" 
            value={newTagName} 
            onChange={(e) => setNewTagName(e.target.value)} 
            className="w-full"
          />
        </div>

        {newTagCategory === 'color' && (
          <div className="space-y-2 w-full sm:w-auto">
            <Label>Color Picker</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                className="w-12 h-10 p-1 cursor-pointer"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
              />
              <span className="text-sm text-gray-500">{newTagColor}</span>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Tag
        </Button>
      </form>

      {/* Tags List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 capitalize text-lg border-b pb-2">
              {category === 'dressType' ? 'Dress Types' : category + 's'}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tags.filter(t => t.category === category).map(tag => (
                <div key={tag.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    {tag.colorHex && (
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: tag.colorHex }} 
                      />
                    )}
                    <span>{tag.name}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {tags.filter(t => t.category === category).length === 0 && (
                <p className="text-sm text-gray-400 italic">No tags yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
