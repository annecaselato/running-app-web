import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

interface ActionCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

export default function ActionCard({ title, description, image, onClick }: ActionCardProps) {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardMedia component="img" height="200" image={image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
