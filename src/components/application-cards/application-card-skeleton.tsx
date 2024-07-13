import { Box, Card, CardContent, CardHeader, Grid, Skeleton, Stack, Typography } from "@mui/material";

export default function ApplicationCardSkeleton({
  numberOfCards
}: {
  numberOfCards: number;
}) {
  const skeleton = Array.from({ length: numberOfCards }).map((_, index) => index);

  const cards = skeleton.map((index) => (
    <Grid item xs={12} md={3} xl={3} key={index}>
      <Card>
        <CardHeader
          title={<Skeleton variant="circular" height={48} width={48}  />}
          action={<Skeleton variant="rounded" height={20} width={20} />}
        />
        <CardContent>
          <Typography variant="subtitle2" width="30%">
            <Skeleton />
          </Typography>
          <Typography variant="body2" mt={1} height={30}>
            <Skeleton height={40} />
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Grid container spacing={3}>
      {cards}
    </Grid>
  );
}
