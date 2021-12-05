using UnityEngine;

public class AnimationStateController : MonoBehaviour
{
    private Animator animator;
    private int isWalkingHash;
    private int isRunningHash;
    private float velocity = 0.0f;
    [SerializeField] private float acceleration = 0.1f;
    [SerializeField] private float decceleration = 0.5f;
    int velocityHash;
    void Start()
    {
        animator = GetComponent<Animator>();
        velocityHash = Animator.StringToHash("Velocity");
        isWalkingHash = Animator.StringToHash("isWalking");
        isRunningHash = Animator.StringToHash("isRunning");
    }

    void oldBooleanAnimation(bool forwardPressed, bool runPressed)
    {
        bool isWalking = animator.GetBool(isWalkingHash);
        bool isRunning = animator.GetBool(isRunningHash);

        if (!isWalking && forwardPressed)
        {
            animator.SetBool("isWalking", true);
        }

        if (isWalking && !forwardPressed)
        {
            animator.SetBool("isWalking", false);
        }

        if (!isRunning && (forwardPressed &&  runPressed))
        {
            animator.SetBool(isRunningHash, true);
        }

        if (isRunning && (!forwardPressed || !runPressed)) {
            animator.SetBool(isRunningHash, false);
        }
    }
    // Update is called once per frame
    void Update()
    {
        bool forwardPressed = Input.GetKey("w");
        bool runPressed = Input.GetKey("left shift");

        // if (forwardPressed && velocity < 1.0f)
        // {
        //     velocity += Time.deltaTime * acceleration;
        // }

        if (forwardPressed && runPressed && velocity < 1.0f)
        {
            velocity += Time.deltaTime * acceleration;
        }

        if (forwardPressed && !runPressed)
        {
            if (velocity < 0.5f)
                velocity += Time.deltaTime * acceleration;
            
            if (velocity > 0.5f)
                velocity -= Time.deltaTime * decceleration;
            
        }

        if (!forwardPressed && velocity > 0.0f)
        {
            velocity -= Time.deltaTime * decceleration;
        }

        if (!forwardPressed && velocity < 0.0f)
        {
            velocity = 0.0f;
        }

        animator.SetFloat(velocityHash, velocity);
    }
}
