using UnityEngine;

public class AnimationStateController : MonoBehaviour
{
    private Animator animator;
    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey("w")) {
            animator.SetBool("isWalking", true);
        }

        if (!Input.GetKey("w")) {
            animator.SetBool("isWalking", false);
        }
        
    }
}
