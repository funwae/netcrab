# Analytics, Heuristics & ML

## 5.1 Heuristic Detectors

**Rage Click Detector:**

* For events within a single session & same `screen_id` & `element_label_h`:

  * If `count(click)` within `Δt ≤ 1s` ≥ 3 → rage_click event.

**Backtrack Detector:**

* Consider navigation sequence of `screen_id`:

  * If pattern `A → B → A` within `≤ 20s` → backtrack.

**Abandoned Task:**

* Custom task start events (SDK call `netcrab.startTask('checkout')`).

* If no corresponding `netcrab.completeTask('checkout')` within `15m` → abandoned.

## 5.2 Scores

Define **Frustration Score** per session:

```text
frustration_score = sigmoid(
  w_rage * rage_clicks +
  w_back * backtracks +
  w_err  * error_events +
  w_ab   * abandoned_tasks
)
```

Define **Efficiency Score** per session:

```text
efficiency_score = sigmoid(
  w_t   * (-duration_ms_normalized) +
  w_clk * (-clicks_per_task_normalized) +
  w_nav * (-unnecessary_routes_normalized)
)
```

Weights are tuned empirically; `sigmoid` keeps scores in (0,1).

Then screen/task-level scores = weighted averages:

```text
screen_frustration = Σ(frustration_score * sessions_weight) / Σ(sessions_weight)
```

## 5.3 ML Layer

1. **Clustering Sessions**

   * Features:

     * `frustration_score`, `efficiency_score`, `click_count`, `duration_ms`, `task_type_one_hot`, summary of screen transitions.

   * Clustering model: mini-batch KMeans or HDBSCAN.

   * Output:

     * Segments like "High-friction short sessions", "Long wandering sessions", "Fast success sessions."

2. **Task Archetype Mining**

   * Represent each session's navigation as a sequence.

   * Convert to n-gram / embedding (e.g., doc2vec or transformer).

   * Cluster to find archetypal flows:

     * `home → search → detail → checkout`

     * `home → featureX → settings → error → home`

3. **LLM Summaries**

   * Prompt with cluster statistics:

     * "Cluster size, top screens, avg scores, dominant error codes"

   * Output:

     * Plain-language descriptions + improvement ideas.

     * These feed into Dashboard "Crab Notes".

