from datetime import datetime

class PriorityCalculator:

    def __init__(self, task):
        self.task = task
        self.today = datetime.today().date()
        self.due_date = datetime.strptime(task["due_date"], "%Y-%m-%d").date()

    def urgency(self):
        days_left = (self.due_date - self.today).days

        if days_left < 0: return 10
        if days_left == 0: return 9
        if days_left <= 3: return 8
        if days_left <= 7: return 6
        return 3

    def importance(self):
        return self.task["importance"]

    def effort(self):
        return max(1, 10 - self.task["estimated_hours"])

    def dependencies(self):
        return len(self.task["dependencies"]) * 2

    def calculate(self, strategy="balance"):
        urg = self.urgency()
        imp = self.importance()
        eff = self.effort()
        dep = self.dependencies()

        if strategy == "fastest":   
            score = (eff * 0.6) + (imp * 0.2) + (urg * 0.2)

        elif strategy == "impact":    
            score = (imp * 0.6) + (urg * 0.3) + (eff * 0.1)

        elif strategy == "deadline": 
            score = (urg * 0.7) + (imp * 0.2) + (eff * 0.1)

        else:
            score = urg * 0.4 + imp * 0.4 + eff * 0.15 + dep * 0.05


        return score,urg,imp,eff,dep    
