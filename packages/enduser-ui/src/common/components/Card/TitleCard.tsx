import Heading from "../ui/Heading";
import { Card } from "./Card";
import React from "react";

interface TitleCardProps {
  title: string;
  children: React.ReactNode;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, children }) => (
  <Card>
    <Heading
      level={3}
      type="headline-xs-eb"
      data-cy="Card.title"
      className="bg-yellow-80 text-neutral-80 rounded-t-2xl py-2 px-4 text-center "
    >
      {title}
    </Heading>
    {children}
  </Card>
);
