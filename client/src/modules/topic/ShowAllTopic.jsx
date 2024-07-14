const data = {
  Life: [
    "Family",
    "Adoption",
    "Children",
    "Elder Care",
    "Fatherhood",
    "Motherhood",
  ],
  Health: ["Aging", "Coronavirus", "Covid-19", "Death And Dying", "Disease"],
  Relationships: ["Dating", "Divorce", "Friendship", "Love", "Marriage"],
};

const ShowAllTopic = () => {
  return (
    <div className="grid-container">
      {Object.entries(data).map(([category, topics]) => (
        <div className="grid-row" key={category}>
          <h2>{category}</h2>
          <div className="grid-columns">
            {topics.map((topic, index) => (
              <div className="grid-column" key={index}>
                {topic}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowAllTopic;
