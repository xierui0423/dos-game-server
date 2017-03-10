const matchService = {};

let id = 0;
const matches = [];

matchService.retrieve = (req, res) => {
    const currentMatch = matches.find(match => match.userIds.includes(req.user.id));
    res.json({ payload: { match: currentMatch || {} } });
};

matchService.create = (req, res) => {
    const currentMatch = matches.find(match => match.userIds.includes(req.user.id));

    if (currentMatch) {
        res.json({
            message: currentMatch.userIds.length > 1 ?
                'Still waiting for someone to join the currently ongoing match.' :
                'You are already in the match.',
            payload: { match: currentMatch },
        });
    } else {
        const waitingMatch = matches.find(match => match.userIds.length === 1);

        if (waitingMatch) {
            waitingMatch.userIds.push(req.user.id);
            res.json({
                message: 'Joined a currently ongoing match.',
                payload: { match: waitingMatch },
            });
        } else {
            const newMatch = {
                id: id += 1,
                userIds: [req.user.id],
            };

            matches.push(newMatch);

            res.json({ message: 'Match has been created!', payload: { match: newMatch } });
        }
    }
};

export default matchService;
