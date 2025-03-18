import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library } from "lucide-react";
import AddAlbumDialog from "./AddAlbumDialog";
import AlbumsTable from "./AlbumsTable";
const AlbumsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-violet-500" /> Albums Library
            </CardTitle>
            <CardDescription>Manage your albums collection</CardDescription>
          </div>
          <AddAlbumDialog />
        </div>
        <CardContent>
          <AlbumsTable />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default AlbumsTabContent;
