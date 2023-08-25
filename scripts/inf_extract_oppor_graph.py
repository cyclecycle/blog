import json
import random
import seaborn as sns

domains = [
    "Medical",
    "Finance",
    "Business",
    "Legal",
    "Research",
    "Education",
    "Govnerment",
    "Social",
    "Manufacturing",
    "Supply chain management",
    "Customer service",
    "Marketing",
    "Human resources",
    "Environmental monitoring",
    "Insurance",
    "Real estate",
]

domain_colors = sns.color_palette("hls", len(domains))
domain2color = {domain: color for domain, color in zip(domains, domain_colors)}

domain2roles = {
    "Medical": [
        "Doctor",
        "Healthcare administrator",
        "Medical billing specialist",
        "Medical researcher",
    ],
    "Finance": [
        "Financial analyst",
        "Financial planner",
        "Risk manager",
    ],
}

role2needs = {
    "Doctor": [
        "To view patient information in an organised and queryable way to help make informed treatment decisions faster."
    ],
    "Healthcare administrator": [
        "To track patient data and identify trends and patterns that can inform improvements in patient care."
    ],
    "Medical billing specialist": [
        "To accurately process and track payment for medical services."
    ],
    "Medical researcher": [
        "Efficiently extract data from scientific papers and clinical trial reports to inform my research."
    ],
    "Financial analyst": [
        "I want quick access to data from a broad range of financial reports and documents to inform my analysis and support my recommendations."
    ],
}

graph = {
    "nodes": [],
    "edges": [],
}

for domain in domains:
    graph["nodes"].append(
        {
            "key": domain,
            "attributes": {
                "node_type": "domain",
                "label": domain,
                "x": random.randint(0, 100),
                "y": random.randint(0, 100),
                "size": 10,
                "color": domain2color[domain],
            },
        }
    )

for domain, roles in domain2roles.items():
    for role in roles:
        graph["nodes"].append(
            {
                "key": role,
                "attributes": {
                    "node_type": "role",
                    "label": role,
                    "x": random.randint(0, 100),
                    "y": random.randint(0, 100),
                    "size": 10,
                },
            }
        )
        graph["edges"].append(
            {
                "source": domain,
                "target": role,
            }
        )

for role, needs in role2needs.items():
    for need in needs:
        graph["nodes"].append(
            {
                "key": need,
                "attributes": {
                    "node_type": "need",
                    "label": need,
                    "x": random.randint(0, 100),
                    "y": random.randint(0, 100),
                    "size": 10,
                },
            }
        )
        graph["edges"].append(
            {
                "source": role,
                "target": need,
            }
        )

with open("./src/data/inf-extract-oppor-map.json", "w") as f:
    json.dump(graph, f, indent=4)
