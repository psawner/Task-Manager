from rest_framework.decorators import api_view
from rest_framework.response import Response

from .priority_algo import PriorityCalculator
from .models import Task
from .serializers import TaskSerializer


@api_view(['POST'])
def analyze_tasks(request):

    data = request.data

    if isinstance(data, dict):
        data = [data]

    strategy = "balance"
    saved_tasks = []

    for t in data:
        calc = PriorityCalculator(t)
        score, urg, imp, eff, de = calc.calculate(strategy)
        t["score"] = round(score,2)

        task_obj = Task.objects.create(
            title=t["title"],
            due_date=t["due_date"],
            estimated_hours=t["estimated_hours"],
            importance=t["importance"],
            dependencies=t["dependencies"],
            score=round(score,2)
        )
        saved_tasks.append(task_obj)

    saved_tasks = sorted(saved_tasks, key=lambda x: x.score, reverse=True)

    serializer = TaskSerializer(saved_tasks, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def suggest_tasks(request):

    strategy = request.GET.get("strategy", "balance") 

    tasks = Task.objects.all()

    if not tasks:
        return Response({"message": "No tasks found. Please POST tasks first."})

    scored_tasks = []

    for task in tasks:
        t = {
            "title": task.title,
            "due_date": str(task.due_date),
            "estimated_hours": task.estimated_hours,
            "importance": task.importance,
            "dependencies": task.dependencies
        }

        calc = PriorityCalculator(t)
        score,urg,imp,eff,dep = calc.calculate(strategy)
        score = round(score, 2)

        explanation = {
            "uregency" : urg,
            "importance" : imp,
            "effort_score" : eff,
            "dependency_score" : dep,
            "strategy_used" : strategy,
            "reasoning": (
                f"Urgency={urg}, Importance={imp}, Effort={eff}, "
                f"Dependencies={dep} → Final Score={score:.2f}"
            )
        }

        scored_tasks.append({
            "title": task.title,
            "score": score,
            "due_date": task.due_date,
            "explanation": explanation
        })

    scored_tasks = sorted(scored_tasks, key=lambda x: x["score"], reverse=True)[:3]

    return Response(scored_tasks)

@api_view(['DELETE'])
def delete_tasks(request):
    Task.objects.all().delete()
    return Response({"message": "All tasks deleted"})
